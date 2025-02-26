import React from 'react'
import { ExternalLink, MapPin, Mail, Calendar, Users, Building2, Globe } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CompanyType } from '@/types/jobs.types'


const CompanyInformationCard = ({ company }: { company: CompanyType }) => {
    const getInitials = (name: string) => {
        return name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      }

  return (
    <Card className="w-full max-w-7xl  bg-background">
    <CardHeader className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={company.companyLogo || ''} alt={company.companyName} />
            <AvatarFallback className="bg-primary/10 text-xl">
              {getInitials(company.companyName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{company.companyName}</h1>
            <p className="text-muted-foreground">{company.companyType}</p>
          </div>
        </div>
        {
          company.website && (
            <Button variant="outline" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
          )
        }  
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{company.city}, {company.country}</span>
      </div>
    </CardHeader>

    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">About</p>
          <p className="text-sm">{company.companyBio}</p>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{company.companyEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Founded {company.foundedYear}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{company.numberOfEmployees} employees</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">CEO: {company.CEOName}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Connect</p>
          <div className="flex gap-2">
            {company.website && (
              <Button variant="outline" size="sm" asChild>
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" />
                  Website
                </a>
              </Button>
            )}
            {company.linkedinLink && (
              <Button variant="outline" size="sm" asChild>
                <a href={company.linkedinLink} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </Button>
            )}
            {company.twitterLink && (
              <Button variant="outline" size="sm" asChild>
                <a href={company.twitterLink} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}

export default CompanyInformationCard