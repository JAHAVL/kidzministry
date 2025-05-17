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

export const POLICY_DATA: Policy[] = [
  { 
    id: 'vision',
    title: 'Vision & Mission', 
    category: 'Vision',
    summary: 'Our vision and mission for Redefine Kidz Ministry.',
    content: `
      At Redefine Kidz, our vision is to partner with parents to see that God is making all things new in the lives of children. 
      
      Our mission is to create a safe, fun, and engaging environment where children can experience God's love, learn biblical truths, and begin their journey of following Jesus.
      
      We believe that every child is created in God's image with unique gifts and abilities. Our goal is to help them discover their identity in Christ and develop a personal relationship with Jesus that will guide them throughout their lives.
      
      Core Values:
      1. Safety First - The physical and emotional safety of every child is our highest priority
      2. Biblical Truth - We teach sound doctrine in age-appropriate ways
      3. Relational Ministry - Building meaningful connections with children and families
      4. Excellence - Doing our best in every aspect of ministry to honor God
      5. Partnership with Parents - Equipping and supporting parents as the primary spiritual influencers
    `,
    tags: ['vision', 'mission', 'values', 'purpose']
  },
  { 
    id: 'team',
    title: 'Team Guidelines', 
    category: 'Team Guidelines',
    summary: 'Guidelines and expectations for all Kidz Team members.',
    content: `
      Team Member Requirements:
      - Must be a regular attendee of Redefine Church for at least 3 months
      - Must complete the volunteer application process, including background check
      - Must attend the Kidz Team orientation and training sessions
      - Must adhere to all safety policies and procedures
      - Must commit to serving at least twice per month
      
      Team Member Expectations:
      - Arrive 30 minutes before service to prepare and pray
      - Wear your Kidz Team t-shirt or lanyard while serving
      - Communicate any absences at least 48 hours in advance
      - Participate in quarterly team meetings
      - Maintain appropriate boundaries with children at all times
      - Model Christ-like behavior both in and out of ministry
      
      Team Structure:
      - Kidz Pastor/Director - Oversees the entire ministry
      - Age Group Coordinators - Lead specific age groups
      - Small Group Leaders - Lead a small group of children
      - Check-in Team - Manage the check-in process
      - Support Team - Assist with setup, teardown, and special events
    `,
    tags: ['volunteers', 'expectations', 'requirements', 'roles', 'structure']
  },
  { 
    id: 'safety', 
    title: 'Safety Policies', 
    category: 'Safety Policies',
    summary: 'Essential safety procedures and protocols for all Kidz Team members.',
    content: `
      Two-Adult Rule:
      - Two screened adults must be present in each room at all times
      - No adult should ever be alone with a child
      
      Check-in/Check-out Procedures:
      - All children must be checked in and receive a name tag
      - Parents must present matching security tag to pick up their child
      - Only authorized parents/guardians may pick up children
      
      Restroom Policies:
      - Children under 5 must be accompanied by a same-gender adult
      - For older children, adults should wait outside the restroom
      - Restroom doors should remain partially open when assisting young children
      
      Illness Policy:
      - Children with fever, vomiting, diarrhea, or contagious conditions should not attend
      - If symptoms develop during service, parents will be notified immediately
      
      Emergency Procedures:
      - Fire evacuation routes are posted in each room
      - First aid kits are located in each classroom
      - Medical incidents must be documented and reported to the Kidz Director
      - For serious emergencies, call 911 and notify the parents immediately
      
      Reporting Suspected Abuse:
      - Report any suspected abuse to the Kidz Director immediately
      - All suspicions will be taken seriously and reported to authorities as required by law
      - Confidentiality will be maintained for all parties involved
    `,
    tags: ['safety', 'protection', 'security', 'emergencies', 'check-in']
  },
  { 
    id: 'behavior',
    title: 'Behavior Guidelines', 
    category: 'Behavior Guidelines',
    summary: 'Guidelines for managing child behavior and creating a positive environment.',
    content: `
      Positive Reinforcement:
      - Praise good behavior specifically ("I like how you shared with your friend")
      - Use reward systems appropriate for age groups
      - Create a positive environment that encourages participation
      
      Discipline Procedures:
      - Always maintain the child's dignity and self-esteem
      - Redirect inappropriate behavior to a more positive activity
      - Use clear, age-appropriate instructions
      - If a child continues to disrupt, use a brief "cool down" time (1 minute per year of age)
      - For persistent issues, involve the age group coordinator and parents
      
      Prohibited Actions:
      - No physical punishment of any kind
      - No verbal abuse, shaming, or threatening language
      - No withholding of basic needs (bathroom, water, etc.)
      - No isolation in an unsupervised area
      
      Special Needs Considerations:
      - Work with parents to understand each child's unique needs
      - Implement accommodations as needed
      - Assign a buddy or helper for children who need additional support
      - Focus on inclusion and acceptance for all children
    `,
    tags: ['behavior', 'discipline', 'special needs', 'positive reinforcement']
  },
  { 
    id: 'communication',
    title: 'Communication Guidelines', 
    category: 'Communication',
    summary: 'Guidelines for communicating with children, parents, and team members.',
    content: `
      Communication with Children:
      - Use age-appropriate language
      - Get down on the child's level when speaking
      - Ask open-ended questions to encourage conversation
      - Listen actively to children's responses and concerns
      - Avoid negative language or comparison between children
      
      Communication with Parents:
      - Greet parents warmly at drop-off and pick-up
      - Share positive observations about their child
      - Address concerns privately, not in front of others
      - Communicate immediately about injuries, illness, or major behavior issues
      - Be responsive to parent questions and feedback
      
      Communication within Team:
      - Use the designated communication platform for scheduling and updates
      - Alert your coordinator as early as possible if you need a substitute
      - Share concerns with leadership privately, not in front of children or parents
      - Participate in team meetings and training opportunities
      - Provide feedback and suggestions through appropriate channels
      
      Digital Communication:
      - Never communicate privately with children through social media or text
      - All electronic communication should include parents
      - Do not post photos of children without parental permission
      - Follow church social media policies
    `,
    tags: ['communication', 'parents', 'team', 'digital', 'social media']
  },
  { 
    id: 'training',
    title: 'Training Resources', 
    category: 'Training',
    summary: 'Training resources and requirements for Kidz Team members.',
    content: `
      Required Training:
      - Initial Orientation (3 hours) - Mission, vision, and basic procedures
      - Safety Training (2 hours) - All safety protocols and emergency procedures
      - Age-Specific Training (2 hours) - Developmental stages and age-appropriate teaching
      - Classroom Management (1 hour) - Creating a positive learning environment
      
      Ongoing Training:
      - Quarterly team meetings with training components
      - Annual refresher training on safety protocols
      - Optional specialized training throughout the year
      - Mentoring opportunities with experienced team members
      
      Online Resources:
      - Access to curriculum guides and lesson plans
      - Video tutorials for check-in system and classroom setup
      - Child development resources
      - Teaching tips and activity ideas
      
      Growth Opportunities:
      - Leadership development for those interested in coordinator roles
      - Specialized training for working with children with special needs
      - Teaching workshops for improving Bible lesson presentation
      - Team-building events and spiritual growth opportunities
    `,
    tags: ['training', 'resources', 'development', 'curriculum', 'growth']
  },
  { 
    id: 'appendix',
    title: 'Appendix & Forms', 
    category: 'Appendix',
    summary: 'Additional resources, forms, and reference materials.',
    content: `
      Available Forms:
      - Volunteer Application
      - Background Check Authorization
      - Incident Report Form
      - Medical Authorization Form
      - Photo Release Form
      - Special Needs Information Form
      - Feedback and Suggestion Form
      
      Contact Information:
      - Kidz Pastor: [Name], [Phone], [Email]
      - Nursery Coordinator: [Name], [Phone], [Email]
      - Preschool Coordinator: [Name], [Phone], [Email]
      - Elementary Coordinator: [Name], [Phone], [Email]
      - Security Team Leader: [Name], [Phone]
      
      Additional Resources:
      - Church Child Protection Policy (full document)
      - Curriculum Scope and Sequence
      - Building Maps and Evacuation Routes
      - Local Emergency Contact Information
      - Recommended Resources for Parents
      
      Frequently Asked Questions:
      - [List of common questions and answers about the ministry]
    `,
    tags: ['forms', 'resources', 'contacts', 'documents', 'FAQ']
  }
];
