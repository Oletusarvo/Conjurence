import { NextRequest, NextResponse } from 'next/server';

type IpData = {
  requestCount: number;
  lastReset: number;
};

export class RateLimiter {
  /**The number of requests a single ip address is allowed to make within the cooldown time. */
  private m_requestLimit: number;

  /**The time in milliseconds how long a single ip is tracked for. */
  private m_ttl: number;

  /**The time in milliseconds until an ip-addresses request count is reset. */
  private m_cooldownTime: number;

  private m_logging?: boolean;

  private m_ipMap: Map<string, IpData> = new Map();

  constructor({
    requestLimit,
    cooldownTime,
    ttl,
    logging,
  }: {
    requestLimit: number;
    cooldownTime: number;
    ttl: number;
    logging?: boolean;
  }) {
    this.m_requestLimit = requestLimit;
    this.m_cooldownTime = cooldownTime;
    this.m_ttl = ttl;
    this.m_logging = logging;
  }

  async limit(req: NextRequest) {
    const ip = req.headers.get('X-Forwarded-For') as string;
    const ipData = ip ? this.m_ipMap.get(ip) : null;

    if (ipData) {
      if (Date.now() - ipData.lastReset > this.m_cooldownTime) {
        //Reset the request count if the cooldown time has passed.
        ipData.requestCount = 0;
        ipData.lastReset = Date.now();
      }

      if (ipData.requestCount >= this.m_requestLimit) {
        return new NextResponse('Too many requests.', {
          status: 429,
          headers: {
            'Retry-After': (this.m_cooldownTime / 1000).toString(),
          },
        });
      }

      ipData.requestCount++;
      if (this.m_logging) {
        console.log(ipData);
      }
    } else {
      //Delete very old entries to prevent memory leaks.
      if (this.m_ipMap.size > 1000) {
        const now = Date.now();
        for (const [key, value] of this.m_ipMap.entries()) {
          if (now - value.lastReset > this.m_ttl) {
            this.m_ipMap.delete(key);
          }
        }
      }

      this.m_ipMap.set(ip, {
        requestCount: 1,
        lastReset: Date.now(),
      });
    }

    return new NextResponse(null, {
      status: 200,
    });
  }
}
