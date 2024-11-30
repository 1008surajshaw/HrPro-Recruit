"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from 'lucide-react';
import { jsPDF } from "jspdf";
import termImg from "../../../public/termImg.png"

export default function PrivacyPolicy() {
//   const downloadAsPDF = () => {
//     const doc = new jsPDF();
//     const content = document.getElementById("privacy-content");
//     if (content) {
//       doc.html(content, {
//         callback: function (doc) {
//           doc.save("privacy-policy.pdf");
//         },
//         x: 15,
//         y: 15,
//         width: 170,
//       });
//     }
//   };

  return (
    <div className="w-full mx-auto py-8 px-4 bg-red-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl flex flex-col mx-auto">
        <div className="flex justify-between items-center gap-8 ">
          {/* Left Section */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">
              Term of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Read our terms below to learn more about your rights and responsibilities
            </p>
          </div>

          {/* Right Section - Document Card */}
          <div className="">
            <Image src={termImg} alt="term img" className="w-[500px] h-[350px]"/>
          </div>
        </div>
      </div>
      <Card className="bg-background mt-8">
        <CardContent>
          <div
            id="privacy-content"
            className="prose dark:prose-invert max-w-none py-10 px-8"
          > 
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-semibold">
                      Privacy Policy and GDPR Compliance
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Please read and accept our privacy policy and GDPR compliance
                      terms to continue.
                    </p>
                </div>
                 <div className="mt-2">
                    {/* <Button
                      variant="default"
                      size="sm"
                      onClick={downloadAsPDF}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button> */}
                 </div>
            </div>
            

            <h2 className="text-xl font-semibold mt-6">1. Introduction</h2>
            <p>
              Welcome to our Job Portal. We are committed to protecting your
              personal data and respecting your privacy rights.
            </p>

            <h2 className="text-xl font-semibold mt-6">2. Data We Collect</h2>
            <p>We collect and process the following data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Personal identification information (Name, email address, phone
                number)
              </li>
              <li>Professional information (CV, work history, education)</li>
              <li>Usage data (How you interact with our portal)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">
              3. How We Use Your Data
            </h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our service</li>
              <li>Match you with potential job opportunities</li>
              <li>
                Communicate with you about your account and job applications
              </li>
              <li>Improve our service</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">
              4. Your Data Protection Rights
            </h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Rectify your personal data</li>
              <li>Erase your personal data</li>
              <li>Restrict processing of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Data portability</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">5. Data Retention</h2>
            <p>
              We will retain your personal data only for as long as necessary
              for the purposes set out in this policy.
            </p>

            <h2 className="text-xl font-semibold mt-6">
              6. Changes to This Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>

            <h2 className="text-xl font-semibold mt-6">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at: hrproams@gmail.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

