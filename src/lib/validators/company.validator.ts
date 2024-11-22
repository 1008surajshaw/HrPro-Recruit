
import { z } from 'zod';

export const companySchema = z.object({
    companyName: z.string().min(1, 'Company name is required'),
    companyLogo: z.string().url('Company logo must be a valid URL'),
    companyEmail: z.string().email('Company email must be a valid email'),
    companyBio: z.string().min(1, 'Company bio is required'),
    foundedYear: z.string().regex(/^\d{4}$/, 'Founded year must be a 4-digit year'),
    numberOfEmployees: z.string(),
    CEOName: z.string().min(1, 'CEO name is required'),
    companyType: z.string().min(1, 'Company type is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    website: z
    .string()
    .refine((url) => url === '' || url.startsWith('https://'), {
      message: 'URL must start with "https"',
    }),
    linkedinLink: z
    .string()
    .refine((url) => url === '' || url.startsWith('https://www.linkedin.com/'), {
      message:
        'URL must be a LinkedIn link starting with "https://www.linkedin.com/"',
    }),
    twitterLink: z
    .string()
    .refine((url) => url === '' || url.startsWith('https://x.com/'), {
      message: 'URL must be a Twitter link starting with "https://x.com/"',
    }),
  });

// Define the type based on the schema
export type CompanySchemaType = z.infer<typeof companySchema>;
