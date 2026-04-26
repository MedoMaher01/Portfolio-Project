## The "Why" Behind The Project

I wanted to understand Linux networking and server management at a deeper level. Buying a Raspberry Pi was the easy option, but engineering a solution using existing hardware was the real challenge. I had to solve kernel-level issues, manage strict Android permissions, and optimize resources for a device with limited RAM.

## What I Built & Achieved

- Total Control: Gained root access and deployed Ubuntu via Linux Deploy.
- Network Security: Configured AdGuard Home to block ads/trackers for all devices at home.
- Cloud Storage: Turned the tablet into a NAS using Samba to share files between my laptop and phone.
- Remote Access: Set up a secure VPN tunnel using Tailscale to access my server from anywhere safely.
- Custom Interface: Coded a responsive dark-mode dashboard to monitor everything.

#### My custom-built dashboard running on the tablet server

![Project Phoenix dashboard screenshot](Image/Screenshot  (1).png)

![Project Phoenix dashboard screenshot](Image/Screenshot  (2).png)

```bash
# Example: Restarting the server services
service apache2 restart
service smbd restart
tailscale up --advertise-exit-node
```
