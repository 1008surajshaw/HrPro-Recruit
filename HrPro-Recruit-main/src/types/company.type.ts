
export interface CompanyType {
    id: string;
    companyName: string;
    companyLogo : string | null ;
    companyEmail : string
    companyBio  : string
    foundedYear : string
    numberOfEmployees  : string
    CEOName      :  string
    companyType  :  string
    city        :   string
    country    :    string
    website    :    string | null;
    linkedinLink  : string | null;
    twitterLink :   string | null;
  }

  
export interface ScreeningQuestion {
  question: string;
  idealAns: string;
}