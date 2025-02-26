'use client'
import { profileCertificateSchema, profileCertificateType } from '@/lib/validators/user.profile.validator';
import { CertificateType } from '@/types/user.types';
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { addUserCertificate, editCertificate } from '@/actions/user.profile.actions';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CertificateForm = ({
    handleClose,
    selectedCertificate,
  }: {
    handleClose: () => void;
    selectedCertificate: CertificateType | null;
  }) => {

    const form = useForm<profileCertificateType>({
        resolver: zodResolver(profileCertificateSchema),
        defaultValues: {
          name: selectedCertificate?.name || '',
          issuingOrganization: selectedCertificate?.issuingOrganization || '',
          issueDate: selectedCertificate?.issueDate ||undefined ,
          expirationDate: selectedCertificate?.expirationDate || undefined ,
          credentialId: selectedCertificate?.credentialId || undefined ,
          credentialUrl : selectedCertificate?.credentialUrl || undefined,
        },
      });
    
      const handleFormClose = () => {
        form.reset();
        form.clearErrors();
        handleClose();
      };
    
      const { toast } = useToast();
    
      const onSubmit = async (data: profileCertificateType) => {
        try {
          let response;
          if (selectedCertificate?.id) {
            response = await editCertificate({
              data: data,
              id: selectedCertificate?.id,
            });
          } else {
            response = await addUserCertificate(data);
          }
    
          if (!response.status) {
            return toast({
              title: response.message || 'Error',
              variant: 'destructive',
            });
          }
          toast({
            title: response.message,
            variant: 'success',
          });
    
          handleFormClose();
        } catch (_error) {
          toast({
            title: 'Something went wrong while Adding Certificate',
            description: 'Internal server error',
            variant: 'destructive',
          });
        }
      };

  return (
    <div className=' flex-1 relative overflow-y-auto no-scrollbar'>
        <Form {...form}>
           <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 h-full flex flex-col justify-between"
            >
            <div className="flex flex-col gap-y-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                    <Input
                        placeholder="name"
                        {...field}
                        className="rounded-[8px]"
                    />
                    </FormControl>
                </FormItem>
                )}
            />
            {/* Issuing Organization */}
            <FormField
                control={form.control}
                name="issuingOrganization"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Issuing Organization</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter issuing organization" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Issue Date */}
            <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Issue Date</FormLabel>
                        <FormControl>
                            <Input
                                type="date"
                                {...field}
                                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                onChange={(e) => field.onChange(new Date(e.target.value))}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Expiration Date */}
            <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Expiration Date</FormLabel>
                        <FormControl>
                            <Input
                                type="date"
                                {...field}
                                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                onChange={(e) =>
                                    field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Credential ID */}
            <FormField
                control={form.control}
                name="credentialId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Credential ID</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter credential ID" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Credential URL */}
            <FormField
                control={form.control}
                name="credentialUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Credential URL</FormLabel>
                        <FormControl>
                            <Input
                                type="url"
                                placeholder="Enter URL to verify credential"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
                    
            </div>

            <div className="py-4 flex gap-4 justify-end">
            <Button
              onClick={handleFormClose}
              variant={'outline'}
              className="mt-0 text-slate-500 dark:text-white rounded-[8px]"
              type="reset"
            >
              Cancel
            </Button>
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="mt-0 text-white rounded-[8px]"
            >
              {form.formState.isSubmitting
                ? 'Please wait ...'
                : `${selectedCertificate?.id ? 'Update Certificate' : 'Add Certificate'}`}
            </Button>
          </div>
           </form>
        </Form>
    </div>
  )
}

export default CertificateForm