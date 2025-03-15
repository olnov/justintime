import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class MailNotifierService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  // async sendEmail(): Promise<any> {
  // const API_ENDPOINT = 'https://api.unisender.com/ru/api/sendEmail';
  //
  // // Build query parameters as required by Unisender API
  // const params = new URLSearchParams();
  // params.append('format', 'json');
  // params.append('api_key', 'API_KEY'); // Replace with your actual API key
  // params.append('email', 'support@novlab.org'); // Replace with recipient details
  // params.append('sender_name', 'Novlab Support'); // Replace with your sender name
  // params.append('sender_email', 'support@novlab.org'); // Replace with your sender email
  // params.append('subject', 'Service notification'); // Replace with your email subject
  // params.append('body', 'You have a booking at 10'); // Replace with your email body (HTML or plain text)
  // // params.append('error_checking', '1'); // Optional: for enabling error checking
  // params.append('list_id', '1');
  // params.append('lang', 'en');
  //
  // // Construct the full URL with query parameters
  // const fullUrl = `${API_ENDPOINT}?${params.toString()}`;
  //
  // // Make the GET request to Unisender
  // const response$ = this.httpService.get(fullUrl);
  // const response = await lastValueFrom(response$);
  // console.log(response.data);
  // return response.data;

  // TODO: think about the multitenancy approach here...

  async sendEmail(emailDto: EmailDto): Promise<any> {
    const { from, to, subject, html } = emailDto;
    const mailgunDomain = 'novlab.org';
    const apiKey = this.configService.get<string>('MAILGUN_API_KEY');
    const url = `https://api.eu.mailgun.net/v3/${mailgunDomain}/messages`;

    // Prepare the form data
    const params = new URLSearchParams();
    params.append('from', from);
    params.append('to', to);
    params.append('subject', subject);
    params.append('html', html);
    // Send the POST request to Mailgun
    const response$ = this.httpService.post(url, params.toString(), {
      auth: {
        username: 'api', // Mailgun requires "api" as the username
        password: apiKey,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Convert observable to promise and return the data
    const response = await lastValueFrom(response$);
    return response.data;
  }
}
