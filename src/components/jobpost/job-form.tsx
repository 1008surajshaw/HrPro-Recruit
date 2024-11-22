'use client';
import { createJob } from '@/actions/job.action';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Wand2 } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import { useForm  } from 'react-hook-form';
import {
  JobPostSchema,
  JobPostSchemaType,
} from '@/lib/validators/jobs.validator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Calendar as CalendarIcon,
  LucideRocket,
  MailOpenIcon,
  X,
} from 'lucide-react';
import DescriptionEditor from './DescriptionEditor';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

import { Card, CardContent } from "@/components/ui/card"

import { Currency, EmployementType } from '@prisma/client';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import APP_PATHS from '@/config/path.config';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { SkillsCombobox } from '../user/skills-combobox';
import { Textarea } from '../ui/textarea';
import CustomQuestions, { ScreeningQuestion } from './custom-question/CustomQuestions';
import { improveText } from '@/actions/textgeneration.action';

const PostJobForm = ({compnayId}:{compnayId:string}) => {

  const session = useSession();
  const router = useRouter();

  const [hasCustomQuestions, setHasCustomQuestions] = useState<boolean>(false);

  const [screeningQuestions, setScreeningQuestions] = useState<
  ScreeningQuestion[]
>([]);


const [isGenerating, setIsGenerating] = useState(false);


const [customMessage,setCustomMessages] = useState<boolean>(false)


  useEffect(() => {
    if (session.status !== 'loading' && session.status === 'unauthenticated')
      router.push(`${APP_PATHS.SIGNIN}?redirectTo=/create`);
  }, [session.status, router]);

  const { toast } = useToast();


  const form = useForm<JobPostSchemaType>({
    defaultValues: {
      title: '',
      description: '',
      currency: 'USD',
      hasExperiencerange: true,
      minExperience: 0,
      maxExperience: 0,
      workMode: 'remote',
      type: EmployementType.Full_time,
      category: 'design',
      hasExpiryDate: false,
      expiryDate: undefined,
      hasSalaryRange: true,
      minSalary: 0,
      maxSalary: 0,
      application: '',
      rejectionMessage:'',
      acceptanceMessage:'',
      responsibilities:[],
      customQuestions:[],
      skills:[]
    },
  });
  
 

  const handleDescriptionChange = (fieldName: any, value: String) => {
    form.setValue(fieldName, value);
  };

  const toggleCustomQuestions = () => {
    setHasCustomQuestions((prev) => !prev);
  };

  const toggleCustomMessage = () => {
    setCustomMessages((prev) => !prev);
  };

  
  const onSubmit = async (data: JobPostSchemaType) => {
    // console.log('Form submitted with data:', data);
    
    try {
      // Validate companyId
      if (!compnayId) {
        toast({
          title: 'Company ID is required',
          variant: 'destructive',
        });
        return;
      }

      const formattedData = {
        ...data,
        compnayId,
        customQuestions: hasCustomQuestions ? screeningQuestions : [],
        minSalary: data.hasSalaryRange ? Number(data.minSalary) : undefined,
        maxSalary: data.hasSalaryRange ? Number(data.maxSalary) : undefined,
        minExperience: data.hasExperiencerange ? Number(data.minExperience) : undefined,
        maxExperience: data.hasExperiencerange ? Number(data.maxExperience) : undefined,
        expiryDate: data.hasExpiryDate ? data.expiryDate : undefined,
      };

      // console.log('Sending formatted data:', formattedData);

      const response = await createJob(formattedData);
      // console.log('Server response:', response);
      
      if (response && !response.status ) {
        toast({
          title: response.message || 'Error',
          variant: 'destructive',
        });
        return;
      }
      if(response){

        toast({
          title: response.message,
          variant: 'success',
        });
      }

      // Reset form and state
      form.reset();
      setComboBoxSelectedValues([]);
      setScreeningQuestions([]);
      setHasCustomQuestions(false);
      setCustomMessages(false);
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Something went wrong while creating job',
        description: error instanceof Error ? error.message : 'Internal server error',
        variant: 'destructive',
      });
    }
  };


  const watchHasSalaryRange = form.watch('hasSalaryRange');
  const watchHasExperienceRange = form.watch('hasExperiencerange');
  const watchHasExpiryDate = form.watch('hasExpiryDate');


  useEffect(() => {
    if (hasCustomQuestions) {
      form.setValue('customQuestions', screeningQuestions);
    } else {
      form.setValue('customQuestions', []);
    }
  }, [screeningQuestions, hasCustomQuestions, form]);

  const [comboBoxSelectedValues, setComboBoxSelectedValues] = useState<
    string[]
  >([]);

  React.useEffect(() => {
    if (!watchHasSalaryRange) {
      form.clearErrors(['minSalary', 'maxSalary']);
      form.setValue('minSalary', 0);
      form.setValue('maxSalary', 0);
    }
  }, [watchHasSalaryRange, form]);

  if (session.status === 'loading') return null;
  
 
  const generateResponsibilities = async () => {
    setIsGenerating(true)
    try {
      const title = form.getValues('title')
      let prompt = title || await askForPrompt()
      if (!prompt) {
        setIsGenerating(false)
        return
      }
      const improvedText = await improveText(prompt, 'responsibilities', true)
      const responsibilities = improvedText.split('\n').filter(Boolean)
      form.setValue('responsibilities', responsibilities)
    } catch (error) {
      console.error('Error generating responsibilities:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const askForPrompt = async (): Promise<string> => {
    return new Promise((resolve) => {
      const prompt = window.prompt("Please enter a few words related to the job title or responsibilities:")
      resolve(prompt || '')
    })
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 mb-20">
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='flex-1 space-y-8'>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="dark:bg-gray-800/90 bg-gray-100 backdrop-blur-sm p-4 rounded-lg text-center text-white w-full md:w-56">
              <CalendarIcon className="w-8 h-8 mb-3 mx-auto text-green-500" />
              <p className="text-base font-semibold mb-1 dark:text-inherit text-gray-800">
                Posted for
              </p>
              <p className="dark:text-gray-400 text-gray-600 text-sm">30 days</p>
            </div>

            <div className="dark:bg-gray-800/90 bg-gray-100 backdrop-blur-sm p-4 rounded-lg text-center text-white w-full md:w-56">
              <MailOpenIcon className="w-8 h-8 mb-3 mx-auto text-purple-500" />
              <p className="text-base font-semibold mb-1 dark:text-inherit text-gray-800">
                Emailed to
              </p>
              <p className="dark:text-gray-400 text-gray-600 text-sm">
                17,000 subscribers
              </p>
            </div>

            <div className="dark:bg-gray-800/90 bg-gray-100 backdrop-blur-sm p-4 rounded-lg text-center text-white w-full md:w-56">
              <LucideRocket className="w-8 h-8 mb-3 mx-auto text-orange-500" />
              <p className="text-base font-semibold mb-1 dark:text-inherit text-gray-800">
                Reach
              </p>
              <p className="dark:text-gray-400 text-gray-600 text-sm">
                500,000<span className="text-blue-500">+</span>
              </p>
            </div>
          </div>
          <div className='space-y-6'>
          <div className="flex-col w-full justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col max-w-4xl"
              >
                <div className=" p-6 rounded-lg space-y-7">
                  <h2 className="text-2xl font-semibold mb-6">Job details</h2>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel className="font-medium flex items-center">
                          Job title
                          <span
                            className="text-red-500 ml-1 cursor-pointer"
                            title="This field is required"
                          >
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-full dark:bg-gray-800 dark:border-none "
                            placeholder="What's the job?"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium flex items-center">Category
                          <span
                            className="text-red-500 ml-1 cursor-pointer"
                            title="This field is required"
                            >
                              *
                            </span> 
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="dark:bg-gray-800 dark:border-none dark:text-white">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="development">
                                Development
                              </SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="management">Management</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="support">Support</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="workMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium flex items-center">Work mode
                            <span
                              className="text-red-500 ml-1 cursor-pointer"
                              title="This field is required"
                            >
                              *
                            </span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="dark:bg-gray-800 dark:border-none dark:text-white">
                                <SelectValue placeholder="Select a workmode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="remote">Remote</SelectItem>
                              <SelectItem value="office">Office</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium flex items-center">Type
                          <span
                            className="text-red-500 ml-1 cursor-pointer"
                            title="This field is required"
                          >
                            *
                          </span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="dark:bg-gray-800 dark:border-none dark:text-white">
                                <SelectValue placeholder="Select a type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.keys(EmployementType).map((item, index) => {
                                return (
                                  <SelectItem key={index} value={item}>
                                    {_.startCase(item)}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols gap-2">
                    <div className="flex flex-col gap-2">
                      <div className="">
                        <Label>Salary Range &#40;in $ per annum&#41;</Label>
                      </div>
                      <div className="">
                        <FormField
                          control={form.control}
                          name="hasSalaryRange"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-y-0 gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-gray-300 data-[state=unchecked]:bg-gray-400"
                                />
                              </FormControl>

                              <FormLabel className="mt-0">
                                Do you want to disclose the salary range?
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      {watchHasSalaryRange && (
                        <div className="flex gap-4">
                          <FormField
                            control={form.control}
                            name="minSalary"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <div className="space-y-0.5">
                                  <FormLabel>Min</FormLabel>
                                </div>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="w-full dark:bg-gray-800 border-gray-400"
                                    placeholder="0"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="maxSalary"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <div className="space-y-0.5">
                                  <FormLabel>Max</FormLabel>
                                </div>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="w-full dark:bg-gray-800 border-gray-400"
                                    placeholder="0"
                                  />
                                </FormControl>{' '}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="dark:bg-gray-800 dark:border-none dark:text-white">
                                      <SelectValue placeholder="Select a verified email to display" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.keys(Currency).map((c, index) => {
                                      return (
                                        <SelectItem key={index} value={c}>
                                          {c}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols gap-2">
                    <div className="flex flex-col gap-2">
                      <div className="">
                        <Label>Experience Range in Years</Label>
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="hasExperiencerange"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-y-0 gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-gray-300 data-[state=unchecked]:bg-gray-400"
                                />
                              </FormControl>

                              <FormLabel className="mt-0">
                                Is there an experience range required for this role
                                ?
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      {watchHasExperienceRange && (
                        <div className="flex gap-4">
                          <FormField
                            control={form.control}
                            name="minExperience"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <div className="space-y-0.5">
                                  <FormLabel>Min</FormLabel>
                                </div>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="w-full dark:bg-gray-800 border-gray-400"
                                    placeholder="0"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="maxExperience"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <div className="space-y-0.5">
                                  <FormLabel>Max</FormLabel>
                                </div>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="w-full dark:bg-gray-800 border-gray-400"
                                    placeholder="0"
                                  />
                                </FormControl>{' '}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols gap-2">
                    <Label>Expiry date</Label>
                    <FormField
                      control={form.control}
                      name="hasExpiryDate"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-y-0 gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-gray-300 data-[state=unchecked]:bg-gray-400"
                            />
                          </FormControl>
                          <FormLabel className="mt-0">
                            Does this job posting have an expiry date?
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    {watchHasExpiryDate && (
                      <div className="flex gap-4">
                        <FormField
                          control={form.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <div className="space-y-0.5"></div>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      aria-label="pick-date"
                                      className={`w-[240px] pl-3 text-left font-normal dark:bg-gray-800 
                                          `} // No color change on hover
                                    >
                                      {field.value ? (
                                        format(new Date(field.value), 'PPP')
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <span className="ml-auto">📅</span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      aria-selected={field.value}
                                      onSelect={(date: any) => {
                                        field.onChange(date); // Update the field value with the selected date
                                      }}
                                      aria-disabled={(date: any) =>
                                        date > new Date() ||
                                        date < new Date('1900-01-01')
                                      }
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-1 dark:text-gray-400 max-w-3xl overflow-hidden  items-center ">
                      Job Description
                      <span
                            className="text-red-500 ml-1 cursor-pointer"
                            title="This field is required"
                          >
                            *
                          </span>
                    </label>
                    <div className="dark:bg-gray-800 rounded-xl mt-2 overflow-hidden border-2 ">
                      <DescriptionEditor
                        fieldName="description"
                        initialValue={form.getValues('description')}
                        onDescriptionChange={handleDescriptionChange}
                        placeholder={'Tell in sort job description or word important in the job Description'}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="application"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Application Link
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-full dark:bg-gray-800 dark:border-none dark:text-white"
                            placeholder="Enter a URL or Link for application If any "
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <SkillsCombobox
                    comboBoxSelectedValues={comboBoxSelectedValues}
                    setComboBoxSelectedValues={setComboBoxSelectedValues}
                    form={form}
                  ></SkillsCombobox>

                  <div>
                        <FormField
                          control={form.control}
                          name="responsibilities"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium">
                                Job Responsibilities
                                <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                              </FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Textarea
                                    placeholder="Enter job responsibilities (one per line)"
                                    value={field.value?.join('\n') || ''}
                                    onChange={(e) =>
                                      field.onChange(e.target.value.split('\n').filter(Boolean))
                                    }
                                    className="w-full dark:bg-gray-800 dark:border-none dark:text-white pr-10"
                                    rows={8}
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={generateResponsibilities}
                                  disabled={isGenerating}
                                  className="absolute top-0 right-0 mt-1 mr-1"
                                >
                                  {isGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Wand2 className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Generate responsibilities</span>
                                </Button>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>


                  
                  <div>
                  <div className="flex items-center space-x-4">
                      <Switch
                        id="custom-questions"
                        checked={hasCustomQuestions}
                        onCheckedChange={toggleCustomQuestions}
                      />
                      <label 
                        htmlFor="custom-questions" 
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        want to add  Custom Questions ?
                      </label>
                    </div>

                      {hasCustomQuestions && (
                        <div className="mt-4"> 
                          <CustomQuestions screeningQuestions={screeningQuestions} setScreeningQuestions={setScreeningQuestions} />
                        </div>
                      )}
                  </div>

                  <div className="flex items-center space-x-4">
                      <Switch
                        id="custom-questions"
                        checked={customMessage}
                        onCheckedChange={toggleCustomMessage}
                      />
                      <label 
                        htmlFor="custom-questions" 
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        Want to set any  Custom Message for Accepted and rejected Candidates
                      </label>
                    </div>

                    {customMessage && (
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name='acceptanceMessage'
                          render={({field}) =>(
                            <FormItem>
                              <FormLabel className='font-medium'>
                                Acceptance message
                              </FormLabel>
                              <FormControl>
                              <Textarea
                                  {...field}
                                  className="w-full dark:bg-gray-800 dark:border-none dark:text-white"
                                  placeholder="Enter your acceptance message"
                                  rows={3}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                          />

                        <FormField
                          control={form.control}
                          name='rejectionMessage'
                          render={({field}) =>(
                            <FormItem>
                              <FormLabel className='font-medium'>
                                Acceptance message
                              </FormLabel>
                              <FormControl>
                              <Textarea
                                  {...field}
                                  className="w-full dark:bg-gray-800 dark:border-none dark:text-white"
                                  placeholder="Enter your rejection message "
                                  rows={3}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                          />

                      </div>
                    )}  
                </div>
                <div className="w-full flex justify-end items-center my-4 ">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    aria-label="submit-job"
                  >
                    {form.formState.isSubmitting ? 'Please wait...' : 'Create Job'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          </div>
        </div>

        <div className="lg:w-80 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Total</h3>
                  <p className="text-sm text-muted-foreground">Job post will be pinned for 30 days.</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">$250 USD</span>
                  <Button className="w-32">Post Job</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Premium Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-green-500" />
                  <span className="text-sm">Featured listing</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-green-500" />
                  <span className="text-sm">Email to all subscribers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-green-500" />
                  <span className="text-sm">30 days visibility</span>
                </li>
              </ul>
            </CardContent>
          </Card>
      </div>
      </div>

      
    </div>
  );
};

export default PostJobForm;
