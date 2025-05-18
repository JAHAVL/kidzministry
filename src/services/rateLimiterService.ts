/**
 * RateLimiterService - Provides rate limiting for API calls
 * 
 * This service manages:
 * 1. Short-term rate limiting (e.g., 1 query per 5 seconds)
 * 2. Daily quota limits (e.g., 50 queries per day)
 * 3. Development mode bypass option
 */

// User rate limiting storage structure
interface UserRateLimits {
  lastQueryTime: number;
  dailyQueries: number;
  lastDayReset: number;
}

class RateLimiterService {
  private rateLimits: Map<string, UserRateLimits> = new Map();
  
  // Configuration parameters with defaults
  private shortTermLimit: number = 5000; // 5 seconds in milliseconds
  private dailyLimit: number = 50;
  private devMode: boolean = false;
  
  constructor() {
    // Try to load persisted rate limits from localStorage
    this.loadRateLimits();
    
    // DEVELOPMENT MODE SETTING
    // Toggle this line to enable/disable rate limiting for development
    // true = no rate limits, false = rate limits active
    const DEVELOPMENT_MODE = true; // <-- TOGGLE THIS LINE for testing
    
    // Store the setting in localStorage so it persists between page reloads
    if (DEVELOPMENT_MODE) {
      localStorage.setItem('kidzTeamDevMode', 'true');
    } else {
      // Use the stored setting or the default setting
      const devModeSetting = localStorage.getItem('kidzTeamDevMode');
      this.devMode = devModeSetting === 'true';
    }
    
    // Apply the development mode setting
    this.devMode = DEVELOPMENT_MODE;
    
    // Set up a periodic cleanup task for expired rate limits
    setInterval(() => this.cleanupExpiredLimits(), 60 * 60 * 1000); // Cleanup every hour
    
    // Log the current mode
    console.log(`[Rate Limiter] ${this.devMode ? 'DEVELOPMENT MODE: Rate limits disabled' : 'PRODUCTION MODE: Rate limits active'}`);
  }
  
  /**
   * Sets development mode which disables all rate limiting
   */
  setDevMode(enabled: boolean): void {
    this.devMode = enabled;
    localStorage.setItem('kidzTeamDevMode', enabled ? 'true' : 'false');
    console.log(`Development mode ${enabled ? 'enabled' : 'disabled'} - Rate limiting ${!enabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Returns the current development mode status
   */
  isDevMode(): boolean {
    return this.devMode;
  }
  
  /**
   * Configure rate limiting parameters
   */
  configure(shortTermLimitSecs: number, dailyLimit: number): void {
    this.shortTermLimit = shortTermLimitSecs * 1000;
    this.dailyLimit = dailyLimit;
    console.log(`Rate limiter configured: ${shortTermLimitSecs}s between queries, ${dailyLimit} daily maximum`);
  }
  
  /**
   * Checks if a request for a given user ID can proceed
   * based on rate limiting rules
   */
  canMakeRequest(userId: string = 'default'): { allowed: boolean; reason?: string; waitTime?: number } {
    // If dev mode is enabled, always allow requests
    if (this.devMode) {
      return { allowed: true };
    }
    
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);
    
    // Initialize or get this user's rate limit data
    if (!this.rateLimits.has(userId)) {
      this.rateLimits.set(userId, {
        lastQueryTime: 0,
        dailyQueries: 0,
        lastDayReset: todayStart
      });
    }
    
    const userLimits = this.rateLimits.get(userId)!;
    
    // Check if we need to reset the daily counter
    if (userLimits.lastDayReset < todayStart) {
      userLimits.dailyQueries = 0;
      userLimits.lastDayReset = todayStart;
    }
    
    // Check daily quota
    if (userLimits.dailyQueries >= this.dailyLimit) {
      const nextReset = new Date(todayStart + 24 * 60 * 60 * 1000);
      return { 
        allowed: false, 
        reason: `Daily query limit of ${this.dailyLimit} reached`,
        waitTime: nextReset.getTime() - now
      };
    }
    
    // Check time since last query
    const timeSinceLastQuery = now - userLimits.lastQueryTime;
    if (timeSinceLastQuery < this.shortTermLimit) {
      return { 
        allowed: false, 
        reason: 'Rate limit exceeded',
        waitTime: this.shortTermLimit - timeSinceLastQuery
      };
    }
    
    // Request is allowed - update the user's limits
    return { allowed: true };
  }
  
  /**
   * Records a successful API request for a user
   */
  recordRequest(userId: string = 'default'): void {
    // Don't record if in dev mode
    if (this.devMode) return;
    
    const now = Date.now();
    const userLimits = this.rateLimits.get(userId);
    
    if (userLimits) {
      userLimits.lastQueryTime = now;
      userLimits.dailyQueries++;
      this.saveRateLimits();
    }
  }
  
  /**
   * Returns rate limit status information for a user
   */
  getRateLimitStatus(userId: string = 'default'): { 
    isLimited: boolean; 
    dailyUsage: number; 
    dailyLimit: number; 
    timeUntilNextQuery: number 
  } {
    const now = Date.now();
    const userLimits = this.rateLimits.get(userId);
    
    if (!userLimits) {
      return {
        isLimited: false,
        dailyUsage: 0,
        dailyLimit: this.dailyLimit,
        timeUntilNextQuery: 0
      };
    }
    
    const timeSinceLastQuery = now - userLimits.lastQueryTime;
    const timeUntilNextQuery = Math.max(0, this.shortTermLimit - timeSinceLastQuery);
    
    return {
      isLimited: timeUntilNextQuery > 0 || userLimits.dailyQueries >= this.dailyLimit,
      dailyUsage: userLimits.dailyQueries,
      dailyLimit: this.dailyLimit,
      timeUntilNextQuery
    };
  }
  
  /**
   * Save current rate limits to localStorage for persistence
   */
  private saveRateLimits(): void {
    try {
      localStorage.setItem('kidzTeamRateLimits', 
        JSON.stringify(Array.from(this.rateLimits.entries())));
    } catch (error) {
      console.error('Error saving rate limits to localStorage:', error);
    }
  }
  
  /**
   * Load rate limits from localStorage if available
   */
  private loadRateLimits(): void {
    try {
      const savedLimits = localStorage.getItem('kidzTeamRateLimits');
      if (savedLimits) {
        this.rateLimits = new Map(JSON.parse(savedLimits));
      }
    } catch (error) {
      console.error('Error loading rate limits from localStorage:', error);
    }
  }
  
  /**
   * Remove expired rate limits to avoid memory issues
   */
  private cleanupExpiredLimits(): void {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    // Remove entries older than one day that aren't from today
    for (const [userId, limits] of this.rateLimits.entries()) {
      if (limits.lastQueryTime < oneDayAgo) {
        this.rateLimits.delete(userId);
      }
    }
    
    // Save the cleaned up limits
    this.saveRateLimits();
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiterService();

// Default configuration
rateLimiter.configure(5, 50); // 5 seconds between queries, 50 queries per day

export default rateLimiter;
