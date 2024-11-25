'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Loader2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createZoomMeet } from '@/actions/zoom.action';
import { useToast } from '@/components/ui/use-toast';
import { createZoomMeetingSchema, CreateZoomMeetingInput } from '@/lib/validators/zoom.validators';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MeetingSchedulerProps {
  recruiterId: string;
  candidateId: string;
  jobApplicationId: number;
}

const MeetingScheduler = ({ 
  recruiterId, 
  candidateId, 
  jobApplicationId 
}: MeetingSchedulerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateZoomMeetingInput>({
    resolver: zodResolver(createZoomMeetingSchema),
    defaultValues: {
      recruiterId,
      candidateId,
      jobApplicationId,
      topic: '',
      startTime: new Date(),
      duration: 30,
      password: '',
    },
  });

  const onSubmit = async (data: CreateZoomMeetingInput) => {
    setIsSubmitting(true);
    console.log('Form data before submission:', data);
    try {
      const payload = {
        ...data,
        startTime: data.startTime,
      };
      console.log('Payload being sent to createZoomMeet:', payload);
      const response = await createZoomMeet(payload);
      console.log('Response from createZoomMeet:', response);
      
      if (response) {
        toast({
          title: "Zoom Meeting has been Scheduled",
          variant: 'success'
        });
        form.reset();
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Failed to create meeting:', error);
      toast({
        title: 'Error creating Zoom Meeting',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Schedule Interview</h2>
        <p className="text-muted-foreground">
          Set up a Zoom meeting with the candidate
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Topic</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Technical Interview Round"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 opacity-50" />
                    <Controller
                      name="startTime"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            const [hours, minutes] = value.split(':');
                            const newDate = new Date(field.value);
                            newDate.setHours(parseInt(hours, 10));
                            newDate.setMinutes(parseInt(minutes, 10));
                            field.onChange(newDate);
                          }}
                          value={format(field.value, 'HH:mm')}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 * 4 }).map((_, index) => {
                              const hours = Math.floor(index / 4);
                              const minutes = (index % 4) * 15;
                              const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                              return (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={15}
                    max={180}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Password (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="text"
                    placeholder="Enter meeting password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Meeting...
              </>
            ) : (
              'Schedule Meeting'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MeetingScheduler;

