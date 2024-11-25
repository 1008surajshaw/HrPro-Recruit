import axios from 'axios';
import { encode } from 'base-64';
import { CreateZoomMeetingInput } from '@/lib/validators/zoom.validators';

export class ZoomAPI {
  private clientId: string;
  private clientSecret: string;
  private accountId: string;
  private baseUrl = 'https://api.zoom.us/v2';

  constructor() {
    this.clientId = process.env.ZOOM_CLIENT_ID!;
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET!;
    this.accountId = process.env.ZOOM_ACCOUNT_ID!;
  }

  private async getAccessToken(): Promise<string> {
    const auth = encode(`${this.clientId}:${this.clientSecret}`);
    const response = await axios.post(
      'https://zoom.us/oauth/token',
      new URLSearchParams({
        grant_type: 'account_credentials',
        account_id: this.accountId,
      }),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;
  }

  async createMeeting(data: CreateZoomMeetingInput) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.post(
        `${this.baseUrl}/users/me/meetings`,
        {
          topic: data.topic,
          type: 2, // Scheduled meeting
          start_time: data.startTime,
          duration: data.duration,
          password: data.password,
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: true,
            password_requirement: true
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create Zoom meeting: ${error.message}`);
    }
  }
}