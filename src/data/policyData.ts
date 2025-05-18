/**
 * Comprehensive policy data for Redefine Church Kidz Ministry
 * This data will be used for TinyLlama-powered semantic search
 */

export interface Policy {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  tags?: string[];
}

// Debugging info to clearly see which ID maps to which policy
console.log('Policy Data loading - check IDs for uniqueness');

export const POLICY_DATA: Policy[] = [
  { 
    id: 'movement-vision',
    title: '1. Movement & Vision', 
    category: 'Vision',
    summary: 'Our movement, vision, and code for Redefine Church and Kidz Ministry.',
    content: `
      ## 1. Movement & Vision

      ### 1.1 Movement
      Our church exists so that the broken would be redefined to the restored through Jesus Christ.

      ### 1.2 Vision
      See that God is making all things new.

      ### 1.3 Our Code

      1. We do what we do because God is who He is  
         *It's about honoring God*

      2. We love our neighbor because God first loved us  
         *It's about honoring People*

      3. We Believe In Maximizing Resources  
         *It's about being grateful for provision*

      4. We Believe In Focused Excellence  
         *It's about it being worth our best*

      5. We Are Contributors, not Consumers  
         *It's about being the church*

      6. We Believe In Defined Authority  
         *It's about trusting God and empowering people*

      7. We Embrace limitations  
         *It's about wisdom*

      8. We Value Teachable Attitudes  
         *It's about humility*

      9. We don't maintain, we multiply  
         *It's about growth*

      10. We are who God has called us to be  
          *It's about authenticity*
    `,
    tags: ['vision', 'mission', 'values', 'purpose', 'movement', 'code']
  },
  { 
    id: 'team-guidelines',
    title: '2. Team Guidelines', 
    category: 'Team Guidelines',
    summary: 'Requirements and responsibilities for all Kidz Team volunteers.',
    content: `
      ## 2. Team Guidelines

      ### 2.1 Volunteer Requirements
      - [ ] Background check completed
      - [ ] Ministry Safe training completed
      - [ ] Complete "Why Redefine" orientation
      - [ ] Attend Start Day training

      ### 2.2 Weekly Schedule
      - Sunday Worship Experiences: 9:00 AM and 11:00 AM
      - Volunteer Huddle: 8:15 AM (all volunteers must attend)
      - Service Times:
        - First Worship Experience: 9:00 AM - 10:30 AM
        - Second Worship Experience: 11:00 AM - 12:30 PM

      ### 2.3 Service Responsibilities
      
      Before Worship Experience (Arrive by 8:45 AM for first service, 10:45 AM for second service)
      - Attend 8:15 AM huddle (first service team)
      - Check-in at the check-in kiosk
      - Review lesson plan and materials
      - Prepare classroom environment
      - Be in position 15 minutes before worship experience begins

      During Worship Experience
      - Follow all safety protocols
      - Critical Safety Rules:
        - Never leave children unattended in a room
        - Never allow a child to leave the room unaccompanied by an authorized adult
      - Engage with children positively
      - Follow the provided curriculum
      - Maintain proper supervision ratios at all times
      - Stay in assigned position until 15 minutes after worship experience ends

      After Worship Experience
      - Clean and organize classroom
      - Return all materials
      - Complete any necessary reports
      - Check out with Kidz Ministry leader

      ### 2.4 Sit One, Serve One Policy
      - Volunteers are expected to serve for one worship experience and attend the other
      - This ensures all volunteers have the opportunity for spiritual growth and community
      - Please coordinate with your team leader to schedule your serving rotation
    `,
    tags: ['volunteers', 'expectations', 'requirements', 'roles', 'structure', 'schedule', 'responsibilities']
  },
  { 
    id: 'safety-policies', 
    title: '3. Safety Policies', 
    category: 'Safety Policies',
    summary: 'Essential safety procedures and protocols for all Kidz Team members.',
    content: `
      ## 3. Safety Policies

      ### 3.1 Check-In/Check-Out Procedures

      #### 3.1.1 Check-In Location
      - All children must be checked in at the check-in kiosk before proceeding to classrooms
      - Volunteers should direct new families to the kiosk for registration

      #### 3.1.2 Primary Method: Redefine Church App
      Parent/Guardian Instructions
      - If not already registered, create an account by filling out the online connect card at [redefine.church](https://redefine.church)
      - Download the Redefine Church app from your device's app store

      Check-In Process
      - Parent logs into the Redefine Church app
      - Clicks on "Profile"
      - Selects "Kids"
      - Chooses the appropriate child
      - Toggles the check-in button
      - System sends a notification to the designated Kidz leader
      - Kidz leader must verify and accept the check-in in the system
         - Important: Never accept a child without confirmed check-in in the system

      Check-Out Process
      - Parent follows the same steps as check-in to toggle check-out
      - System notifies Kidz leader of check-out request
      - Kidz leader verifies identity before releasing the child
      - Complete the check-out process in the system

      #### 3.1.3 Backup Method: iPad Check-In Station
      - Located at the Kidz Check-In desk
      - Only to be used if app is unavailable
      - Parent/guardian must provide confirmation number for check-out
      - Important: Never release a child without proper confirmation number verification

      #### 3.1.4 Important Notes
      - The app is the primary and preferred method
      - Always verify the identity of the person picking up the child
      - Double-check all check-ins/check-outs for accuracy
      - Report any issues to Kidz Ministry leadership immediately

      ### 3.2 Health & Hygiene
      - [Illness policy]
      - [Diaper changing procedures]
      - [Bathroom assistance guidelines]
      - [Allergy management procedures]

      ### 3.3 Emergency Procedures
      - [Fire evacuation]
      - [Lockdown procedures]
      - [First aid protocols]
      - [Health incident response]
      - [Incident reporting]
      - Follow lockdown procedures when announced over the communication system
      - In case of severe weather, follow shelter-in-place protocols

      ### Two-Adult Rule
      - Two screened adults must be present in each room at all times
      - No adult should ever be alone with a child
      - Maintain appropriate adult-to-child ratios for each age group:
        - Infants (0-12 months): 1:3
        - Toddlers (12-36 months): 1:5
        - Preschool (3-5 years): 1:8
        - Elementary (K-5th): 1:10

      ### Restroom Policies
      - Children under 5 must be accompanied by a same-gender adult
      - For older children, adults should wait outside the restroom
      - Restroom doors should remain partially open when assisting young children
      - For group bathroom breaks, two adults must be present
    `,
    tags: ['safety', 'emergencies', 'check-in', 'supervision', 'health', 'hygiene', 'restroom', 'two-adult rule', 'protection', 'security']
  },
  { 
    id: 'behavior-guidelines-and-discipline',
    title: '4. Behavior Guidelines', 
    category: 'Behavior Guidelines',
    summary: 'Standards for conduct and interactions for volunteers and children, including detailed discipline policy.',
    content: `
      ## 4. Behavior Guidelines

      ### 4.1 For Volunteers

      #### 4.1.1 Code of Conduct
      - Always maintain appropriate physical boundaries with children
      - Use positive reinforcement and redirection rather than negative discipline
      - Never be alone with a single child where you cannot be observed by others
      - Report any concerning behaviors or safety issues immediately
      - No use of personal devices while supervising children (except for ministry purposes)
      - Maintain confidentiality regarding family information

      #### 4.1.2 Dress Code
      - Wear your Redefine Kidz volunteer t-shirt or approved ministry attire
      - Comfortable, modest clothing that allows for movement (no short shorts, tank tops, or revealing clothing)
      - Closed-toe shoes are required for safety
      - No clothing with inappropriate messages or imagery
      - Name tags must be worn and visible at all times

      #### 4.1.3 Communication Policies

      Issue Reporting
      - All concerns about children must be reported to the Kidz Leader immediately
      - Document every incident on the appropriate form
      - Maintain strict confidentiality regarding sensitive information
      - Follow the proper chain of communication for all concerns

      Documentation Guidelines
      - Document all behavior incidents in the communication log
      - Complete Incident Report Forms for any injury or serious behavior issue
      - Include date, time, details, and witness statements
      - Document any first aid or interventions provided
      - Note parent notifications and their responses
      - Sign and date all documentation

      Parent Communication
      - Direct parent questions about ministry to the Kidz Leader
      - Avoid discussing sensitive information during pick-up and drop-off
      - Let leaders handle all behavior issue communications
      - Refer discipline or development concerns to Kidz Leader

      Social Media
      - Interaction with children/families should be limited to official church accounts

      ### 4.2 For Children

      Behavior Expectations
      - Respect leaders and other children
      - Follow classroom rules and instructions
      - Use kind words and actions

      ### 4.3 Discipline Policy

      #### 4.3.1 Step 1: Redirection & Reminder
      Action
      - Gently remind the child of the expected behavior
      - Offer positive alternatives
      - Use "I" statements ("I need you to..." instead of "Don't...")
      
      Examples
      - "I need you to use walking feet in God's house. Would you like to walk with me?"
      - "We use kind words with our friends. Let's try saying that again nicely."
      - "I see you're having trouble keeping your hands to yourself. Let's find a way to play together safely."

      #### 4.3.2 Step 2: Time-Out & Reflection
      Action
      - Move the child to a designated quiet area (within view of the group)
      - Keep time-out brief (1 minute per year of age)
      - After time-out, discuss what happened and how to make better choices
      - Have the child practice the correct behavior
      
      Examples
      - "I noticed you were throwing toys. That's not safe. Let's take a break and think about how we can play safely."
      - "You need to sit here for 5 minutes because you weren't following directions. When you're ready to listen, you can rejoin the group."
      - After time-out: "Can you show me how we should treat our friends?"

      #### 4.3.3 Step 3: Leader Intervention & Parent Notification
      Action
      - Escalate to the Kidz Leader if behavior continues after Steps 1 & 2
      - Leader will speak with the child and complete an Incident Report Form
      - Parents will be notified by the Kidz Leader after the service
      - For severe behaviors (hitting, biting, etc.), parents may be called immediately
      
      Examples
      - "I see you're still having trouble following our rules. Let's go talk to [Leader's Name] about how we can help you make better choices."
      - "Because you chose to continue [behavior] after multiple reminders, we need to let your parents know so we can all work together."
      - "That behavior is not safe. I need to call your parents so we can make sure everyone stays safe."

      #### 4.3.4 Important Notes
      - Always remain calm and patient
      - Focus on the behavior, not the child ("That was a bad choice" vs. "You're bad")
      - Document all incidents on the appropriate forms
      - For repeated or severe behaviors, a behavior plan may be developed with parents

      Inclusion Guidelines
      - All children are welcome regardless of ability or background
      - Accommodations will be made as needed
      - Concerns about inclusion should be directed to the Kidz Leader
      - Implement accommodations as needed
      - Assign a buddy or helper for children who need additional support
      - Focus on inclusion and acceptance for all children
    `,
    tags: ['behavior', 'discipline', 'special needs', 'positive reinforcement']
  },
  { 
    id: 'communication-policies',
    title: '5. Communication', 
    category: 'Communication',
    summary: 'Guidelines for effective communication with children, parents, and team members.',
    content: `
      ## 5. Communication

      ### 5.1 Team Communication & Scheduling

      Primary Platform: Redefine Church App
      - All team communications will be sent through the app
      - Check the app regularly for updates and announcements

      Scheduling
      - All scheduling and shift acceptance is managed through the app
      - Volunteers must confirm or decline their scheduled shifts via the app
      - Schedule changes must be requested at least 48 hours in advance when possible

      Weekly Huddles
      - 8:15 AM on Sundays (mandatory for all volunteers)

      Emergency Contacts
      - Available in the Kidz Ministry binder and through the app

      #### 5.1.1 Communication Guidelines
      - Check the app at least twice weekly for updates
      - Respond to direct messages within 24 hours
      - Use appropriate channels for different types of communication
      - Keep all team communication professional and ministry-focused

      ### 5.2 Parent Communication Policies

      Regular Updates
      - Weekly email newsletter (sent every Thursday)
      - Monthly parent newsletter with upcoming events and curriculum previews
      - Text alerts for urgent updates or changes
      - All communications should refer to "worship experiences" rather than "services"

      Parent-Teacher Communication
      - Designated communication hours: 9 AM - 7 PM, Monday-Friday
      - Use official church email for all parent communications
      - Document all significant conversations in the parent communication log
      - Refer all media inquiries to the Kidz Ministry Director

      Social Media
      - Only approved content may be posted on official accounts
      - Obtain photo/video release forms for all children featured
      - Never tag children's full names in social media posts

      ### 5.3 Incident Reporting

      Minor Incidents (bumps, minor disagreements)
      - Document in the classroom log
      - Notify parents at pick-up
      
      Moderate Incidents (injury requiring first aid, behavioral issues)
      - Complete an Incident Report Form immediately
      - Notify Kidz Ministry leadership
      - Parent notification required before child leaves
      
      Major Incidents (serious injury, safety concerns)
      - Notify Kidz Ministry Director immediately
      - Complete all required documentation
      - Follow state-mandated reporting procedures if applicable
      - Document all conversations and actions taken

      #### 5.3.1 Documentation Requirements
      - Complete all forms within 24 hours of the incident
      - Include date, time, location, people involved, and witness statements
      - Document any first aid or interventions provided
      - Note parent notifications and their responses
      - Sign and date all documentation

      Communication with Children
      - Use age-appropriate language
      - Get down on the child's level when speaking
      - Ask open-ended questions to encourage conversation
      - Listen actively to children's responses and concerns
      - Avoid negative language or comparison between children
    `,
    tags: ['communication', 'parents', 'team', 'digital', 'social media', 'incident reporting', 'documentation', 'scheduling']
  },
  { 
    id: 'training-development',
    title: '6. Training & Development', 
    category: 'Training',
    summary: 'Comprehensive training resources and development opportunities for Kidz Team members.',
    content: `
      ## 6. Training & Development

      ### Required Training
      - Initial Orientation (3 hours) - Mission, vision, and basic procedures
      - Safety Training (2 hours) - All safety protocols and emergency procedures
      - Age-Specific Training (2 hours) - Developmental stages and age-appropriate teaching
      - Classroom Management (1 hour) - Creating a positive learning environment
      - Ministry Safe certification - Child protection training
      - Background check completion
      
      ### Ongoing Training
      - Quarterly team meetings with training components
      - Annual refresher training on safety protocols
      - Optional specialized training throughout the year
      - Mentoring opportunities with experienced team members
      - Annual volunteer appreciation and training event
      
      ### Online Resources
      - Access to curriculum guides and lesson plans through the Redefine Church app
      - Video tutorials for check-in system and classroom setup
      - Child development resources
      - Teaching tips and activity ideas
      - Digital library of ministry resources
      
      ### Growth Opportunities
      - Leadership development for those interested in coordinator roles
      - Specialized training for working with children with special needs
      - Teaching workshops for improving Bible lesson presentation
      - Team-building events and spiritual growth opportunities
      - Conference attendance opportunities for committed volunteers
    `,
    tags: ['training', 'resources', 'development', 'curriculum', 'growth', 'required training', 'online resources']
  },
  { 
    id: 'appendix-forms',
    title: '7. Appendix & Forms', 
    category: 'Appendix',
    summary: 'Additional resources, forms, and reference materials including emergency contacts.',
    content: `
      ## 7. Appendix

      ### Available Forms
      - Volunteer Application
      - Background Check Authorization
      - Incident Report Form
      - Medical Authorization Form
      - Photo Release Form
      - Special Needs Information Form
      - Feedback and Suggestion Form
      
      ### Emergency Contacts
      - Tayler Hardison  
        813-404-2610  
        Kidz Ministry Director
      - Nursery Coordinator: [Name], [Phone], [Email]
      - Preschool Coordinator: [Name], [Phone], [Email]
      - Elementary Coordinator: [Name], [Phone], [Email]
      - Security Team Leader: [Name], [Phone]
      
      ### Additional Resources
      - Church Child Protection Policy (full document)
      - Curriculum Scope and Sequence
      - Building Maps and Evacuation Routes
      - Local Emergency Contact Information
      - Recommended Resources for Parents
      
      ### Frequently Asked Questions
      - [List of common questions and answers about the ministry]
      
      *Last updated: May 17, 2025*
    `,
    tags: ['forms', 'resources', 'contacts', 'documents', 'FAQ', 'emergency contacts']
  }
];
