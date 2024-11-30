import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Footer = () => {
  return (
    <footer className="w-full bg-red-600 dark:bg-red-700 text-white pb-5 pt-16 mt-8">
      <div className="container mx-auto px-4 lg:w-10/12">
        <div className="flex flex-wrap justify-between">
          {/* Logo Section */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <div className="mb-4">
              <p className="text-2xl font-bold">HrPro Recruit</p>
            </div>
            
          </div>
          
          {/* Links Section */}
          <div className="flex flex-wrap w-full md:w-2/5 mb-8 md:mb-0">
            <div className="w-1/2 sm:w-1/3 mb-4 sm:mb-0">
              <h5 className="font-bold mb-2">Product</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">All Jobs</a></li>
                <li><a href="#" className="hover:underline">Companies</a></li>
                <li><a href="#" className="hover:underline">Candidates</a></li>
              </ul>
            </div>
            
            <div className="w-1/2 sm:w-1/3 mb-4 sm:mb-0">
              <h5 className="font-bold mb-2">Resources</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">User guides</a></li>
                <li><a href="#" className="hover:underline">Webinars</a></li>
              </ul>
            </div>

            <div className="w-1/2 sm:w-1/3">
              <h5 className="font-bold mb-2">Company</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">About</a></li>
                <li><a href="#" className="hover:underline">Join us</a></li>
              </ul>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <label htmlFor="email" className="block mb-2">For product announcements and exclusive insights</label>
            <div className="flex">
              <Input 
                type="email" 
                id="email" 
                className="rounded-r-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" 
                placeholder="Input your email"
              />
              <Button className="rounded-l-none bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-red-500 dark:border-red-700 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="mb-4 sm:mb-0">
            © 2024 HrPro Recruit. • 
            <a href="/term" className="hover:underline ml-2 mr-2" >Privacy</a> • 
            <a href="/term" className="hover:underline mr-2">Terms</a> • 
            <a href="/term" className="hover:underline">Sitemap</a>
          </p>
          <div className="flex flex-wrap justify-center">
            <a href="#" className="mx-2 my-1 hover:underline">Twitter</a>
            <a href="#" className="mx-2 my-1 hover:underline">Facebook</a>
            <a href="#" className="mx-2 my-1 hover:underline">LinkedIn</a>
            <a href="#" className="mx-2 my-1 hover:underline">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;