'use client'
import { companySchema, CompanySchemaType } from '@/lib/validators/company.validator';
import React , { useCallback, useState,useRef } from 'react'
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CirclePlus} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadFileAction } from '@/actions/upload-to-cdn';
import { X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UserType } from '@/types/user.types';
import { submitImage } from '@/lib/utils';
import { CompanyType } from '@/types/company.type';
import { createCompanyDetails, editCompanyDetails } from '@/actions/user.profile.actions';

const AddCompanyInfo = ({
    handleClose,
    company,
  }: {
    handleClose: () => void;
    company: CompanyType | null;
  }) => {
    const { toast } = useToast()
    const [file, setFile] = useState<File | null>(null)
    const [previewImg, setPreviewImg] = useState<string | null>(company?.companyLogo || null)
  
    const form = useForm<CompanySchemaType>({
      defaultValues: {
        companyName: company?.companyName || '',
        companyLogo: company?.companyLogo || undefined,
        companyEmail: company?.companyEmail || '',
        companyBio: company?.companyBio || '',
        foundedYear: company?.foundedYear || '',
        numberOfEmployees: company?.numberOfEmployees || '',
        CEOName: company?.CEOName || '',
        companyType: company?.companyType || '',
        city: company?.city || '',
        country: company?.country || '',
        website: company?.website || '',
        linkedinLink: company?.linkedinLink || '',
        twitterLink: company?.twitterLink || '',
      },
    })
  
    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles[0].size < 1024 * 1024 * 5 && acceptedFiles[0].type.includes('image')) {
        setFile(acceptedFiles[0])
        // console.log(file,"Comapny Logo")
        setPreviewImg(URL.createObjectURL(acceptedFiles[0]))
        // console.log(previewImg,"previrew Imafe")
      } else {
        toast({
          variant: 'destructive',
          title: 'Company logo should be an image and not more than 5 MB.',
        })
      }
    }, [toast])
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  
    const onSubmit = async (data: CompanySchemaType) => {
      try {
        if (file) {
          const logoUrl = await submitImage(file)
          // console.log(logoUrl,"logo url is this")
          if (logoUrl) {
            data.companyLogo = logoUrl
          }
        }
  
        if (!data.companyLogo) {
          toast({
            title: 'Company logo is required',
            variant: 'destructive',
          })
          return
        }
  
        const response = company?.id
          ? await editCompanyDetails({ data, id: company.id })
          : await createCompanyDetails(data)
  
        if (!response.status) {
          toast({
            title: response.message || 'Error occurred while saving company details',
            variant: 'destructive',
          })
          return
        }
  
        toast({
          title: response.message,
          variant: 'success',
        })
  
        handleFormClose()
      } catch (error) {
        console.error('Error submitting form:', error)
        toast({
          title: 'Something went wrong while saving company details',
          description: 'Internal server error',
          variant: 'destructive',
        })
      }
    }
    const submitImage = async (file: File | null) => {
      if (!file) return;
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const uniqueFileName = `${Date.now()}-${file.name}`;
        formData.append('uniqueFileName', uniqueFileName);
  
        const res = await uploadFileAction(formData, 'webp');
        if (!res) {
          throw new Error('Failed to upload image');
        }
  
        const uploadRes = res;
        return uploadRes.url;
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    };

    const handleClick = () => {
      if (previewImg) return;
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  
      if (fileInput) {
        fileInput.click();
      }
    };
  
    const clearLogoImage = () => {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  
      if (fileInput) {
        fileInput.value = '';
      }
      setPreviewImg(null);
      setFile(null);
      form.setValue('companyLogo', '');
    };
     
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files ? e.target.files[0] : null;
      if (!selectedFile) {
        return;
      }
      if (!selectedFile.type.includes('image')) {
        toast({
          title:
            'Invalid file format. Please upload an image file (e.g., .png, .jpg, .jpeg, .svg ) for the company logo',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (profileImageRef.current) {
          profileImageRef.current.src = reader.result as string;
        }
        setPreviewImg(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      if (selectedFile) {
        setFile(selectedFile);
      }
    };
    const profileImageRef = useRef<HTMLImageElement>(null);
     
    const handleFormClose = () => {
      form.reset();
      form.clearErrors();
      handleClose();
    };

  return (
    <div className='flex-1 relative'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 h-full flex flex-col justify-between'
          >
           <div className=' flex flex-col gap-y-4'>
         
           <FormLabel> Profile Picture </FormLabel>
          <div className="flex justify-center">
            <div
              className="w-40 h-40 relative dark:bg-gray-700 bg-gray-300 border border-dashed border-gray-500 rounded-md flex items-center justify-center cursor-pointer mb-2"
              onClick={handleClick}
            >
              {previewImg ? (
                <Image
                  src={previewImg}
                  ref={profileImageRef}
                  className="object-contain w-full h-full rounded-md overflow-hidden"
                  alt="Company Logo"
                  width={160}
                  height={160}
                />
              ) : (
                <FaFileUpload
                  height={80}
                  width={80}
                  className="text-white h-10 w-10"
                />
              )}
              {previewImg && (
                <button
                  type="button"
                  onClick={clearLogoImage}
                  className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full items-center flex justify-center cursor-pointer translate-x-1/2 -translate-y-1/2"
                >
                  <X size="16" />
                </button>
              )}
            </div>

            <input
              id="fileInput"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>


            <FormField
              control={form.control}
              name='companyName'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter Company Name' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            
            <FormField
              control={form.control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Company Email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter Company Bio" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foundedYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Founded Year</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Founded Year" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Employees</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Number of Employees" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="CEOName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEO Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter CEO Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Company Type" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter City" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Country" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input 
                       placeholder="https://" 
                       {...field} 
                       className="rounded-[8px]"
                      />
                  </FormControl>
                </FormItem>
              )}
            />

           <FormField
            control={form.control}
            name="linkedinLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linkedin Link </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.linkedin.com/"
                    {...field}
                    className="rounded-[8px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
           <FormField
              control={form.control}
              name="twitterLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://x.com/"
                      {...field}
                      className="rounded-[8px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
           </div>

           <div className="py-4 flex gap-4 justify-end">
              <Button onClick={handleFormClose} variant='outline' type="button">
                Cancel
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting
                  ? 'Please wait...'
                  : company?.id
                  ? 'Update Company Details'
                  : 'Add Company Details'}
              </Button>
            </div>

          </form>
      </Form>
      
    </div>
  )
}

export default AddCompanyInfo