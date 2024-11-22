'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import APP_PATHS from '@/config/path.config';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  SignupSchema,
  SignupSchemaType,
} from '@/lib/validators/auth.validator';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useToast } from '../ui/use-toast';
import { signUp } from '../../actions/auth.actions';
import { DemarcationLine, GoogleOauthButton } from './social-auth';
import { PasswordInput } from '../common/password-input';
import { Label } from '../ui/label';
import { useEffect } from 'react';
import { Role } from '@prisma/client';

export default function Signup() {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER' as Role
    },
  });

  const role = form.watch('role');

  useEffect(() => {
    console.log(role);
  }, [role]);
  
  async function signupHandler(data: SignupSchemaType) {
    try {
      const response = await signUp(data);
      if (!response.status) {
        toast({
          title: response.message || 'Something went wrong',
          variant: 'destructive',
        });
      } else {
        toast({
          title: response.message || 'Signup successful! Welcome to HrPro Recruit!',
          variant: 'success',
        });

        router.push(APP_PATHS.WELCOME);
      }
    } catch {
      toast({
        title: 'something went wrong',
        variant: 'destructive',
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(signupHandler)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Account Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="USER" id="candidate" />
                      <Label htmlFor="candidate">Candidate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="HR" id="recruiter" />
                      <Label htmlFor="recruiter">Recruiter</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="name@gmail.com" />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput field={field} placeholder="Password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Link
              href={APP_PATHS.FORGOT_PASSWORD}
              className="text-xs text-muted-foreground font-medium hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full h-10"
            aria-label="submit"
          >
            {form.formState.isSubmitting ? 'Please wait...' : 'Create Account'}
          </Button>
          {
            role == "USER" &&
            (
              <>
                 <DemarcationLine />
                 <GoogleOauthButton  label="Sign up with Google" />
              </>
            )
          }
         
        </form>
      </Form>
      <div className="flex items-center justify-center mt-6">
        <span className="text-muted-foreground">
          Already have an account?{' '}
          <Link
            href={APP_PATHS.SIGNIN}
            className="text-muted-foreground font-semibold hover:underline"
          >
            Sign In
          </Link>
        </span>
      </div>
    </>
  );
}