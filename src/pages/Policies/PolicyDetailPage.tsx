import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiUsers, FiShield, FiHeart, FiMessageCircle, FiAward, FiClipboard } from 'react-icons/fi';
import './PolicyDetailPage.css';

// This would come from the API or a data file in production
const policyContent = {
  vision: {
    id: 'vision',
    title: 'Movement & Vision',
    icon: FiBookOpen,
    color: '#8a2be2',
    content: `
## 1. Movement & Vision

### 1.1 Movement
Our church exists so that the broken would be redefined to the restored through Jesus Christ.

### 1.2 Vision
See that God is making all things new.

### 1.3 Our Code

1. **We do what we do because God is who He is**  
   *It's about honoring God*

2. **We love our neighbor because God first loved us**  
   *It's about honoring People*

3. **We Believe In Maximizing Resources**  
   *It's about being grateful for provision*

4. **We Believe In Focused Excellence**  
   *It's about it being worth our best*
    `
  },
  team: {
    id: 'team',
    title: 'Team Guidelines',
    icon: FiUsers,
    color: '#4169e1',
    content: `
## 2. Team Guidelines

### 2.1 Volunteer Requirements
- Committed follower of Jesus Christ
- Regular attendee of Redefine Church for at least 3 months
- Completion of background check
- Completion of Kidz Ministry training
- Agreement with and adherence to all policies and procedures

### 2.2 Weekly Schedule
- **Service Times:** 9:00 AM and 11:00 AM
- **Team Arrival Time:** 45 minutes before service (8:15 AM / 10:15 AM)
- **Team Huddle:** 30 minutes before service (8:30 AM / 10:30 AM)

### 2.3 Service Responsibilities
- Arrive on time for team huddle
- Check assigned room for cleanliness and safety
- Set up materials and activities for your age group
- Welcome each child by name and with enthusiasm
- Follow curriculum and schedule for your age group
- Clean and sanitize room after service

### 2.4 Sit One, Serve One Policy
- Team members are encouraged to attend one service and serve one service
- This ensures spiritual growth while serving others
    `
  },
  safety: {
    id: 'safety',
    title: 'Safety Policies',
    icon: FiShield,
    color: '#db7093',
    content: `
## 3. Safety Policies

### 3.1 Check-In/Check-Out Procedures
- All children must be checked in using the digital check-in system
- Child and parent/guardian receive matching security tags
- Only adults with matching security tags may pick up a child
- Children may not be released to siblings under 16 years of age
- For lost security tags, parent/guardian must show photo ID to a Kidz Ministry leader

### 3.2 Health & Hygiene
- Children with the following symptoms should not attend Kidz Ministry:
  - Fever within the past 24 hours
  - Vomiting or diarrhea within the past 24 hours
  - Excessive coughing or runny nose
  - Contagious skin rash
  - Eye infection
  - Head lice
- Medications will not be administered by team members
- Handwashing required for all team members before handling food
- Toys and surfaces are sanitized between services

### 3.3 Emergency Procedures
- Fire evacuation routes are posted in each room
- In case of evacuation, team members should:
  1. Remain calm
  2. Count children and take attendance roster
  3. Exit building according to evacuation route
  4. Take children to designated meeting area
  5. Re-count children and wait for further instructions
- For medical emergencies:
  1. Assess situation
  2. Contact leadership via walkie-talkie
  3. Call 911 if necessary
  4. Keep other children calm and occupied
    `
  },
  behavior: {
    id: 'behavior',
    title: 'Behavior Guidelines',
    icon: FiHeart,
    color: '#8a2be2',
    content: `
## 4. Behavior Guidelines

### 4.1 For Volunteers
- Never be alone with a child; maintain the "two-adult" rule at all times
- Physical contact should be minimal, appropriate, and in public view
- Appropriate contact includes: high fives, brief side hugs, brief touches on shoulders/arms
- Inappropriate contact includes: frontal hugs, kissing, lap sitting (except for nursery), tickling
- Use positive reinforcement for good behavior
- Redirect negative behavior before it escalates
- Speak to children at eye level and with respect
- Use a calm, firm voice when correcting behavior

### 4.2 For Children
- Be respectful to leaders and other children
- Keep hands and feet to yourself
- Use walking feet inside the building
- Use inside voices during classroom time
- Ask permission to leave the room (for bathroom, water, etc.)
- Participate in activities and follow directions

### 4.3 Discipline Policy
1. **Gentle Reminder** - Quietly remind the child of expected behavior
2. **Redirect** - Guide the child to another activity
3. **Cool Down** - If behavior continues, have child sit apart from group for 1 minute per year of age
4. **Leader Assistance** - If behavior is not resolved, seek help from a ministry leader
5. **Parent Contact** - Persistent behavior issues will result in parent notification

*Physical discipline, isolation, yelling, or shaming are never permitted*
    `
  },
  communication: {
    id: 'communication',
    title: 'Communication',
    icon: FiMessageCircle,
    color: '#4169e1',
    content: `
## 5. Communication

### 5.1 Team Communication & Scheduling
- **Primary Communication Tool:** Church App
  - Check the app regularly for updates and announcements
- **Scheduling:**
  - All scheduling and shift acceptance is managed through the app
  - Volunteers must confirm or decline their scheduled shifts via the app
  - Schedule changes must be requested at least 48 hours in advance when possible
- **Weekly Huddles:** 8:15 AM on Sundays (mandatory for all volunteers)
- **Emergency Contacts:** Available in the Kidz Ministry binder and through the app

### 5.1.1 Communication Guidelines
- Check the app at least twice weekly for updates
- Respond to direct messages within 24 hours
- Use appropriate channels for different types of communication
- Keep all team communication professional and ministry-focused

### 5.2 Parent Communication Policies
- **Regular Updates:**
  - Weekly email newsletter (sent every Thursday)
  - Monthly parent handouts with curriculum themes and home activities
  - Quarterly parent meetings for feedback and questions
- **Individual Communication:**
  - Use written "Notes Home" forms for specific child updates
  - Sensitive issues should be discussed in person, not at pickup time
  - All electronic communication with parents should copy a ministry leader

### 5.3 Incident Reporting
- Complete an incident report form for:
  - Injuries requiring first aid
  - Behavioral incidents requiring parent notification
  - Security concerns or check-in/out issues
  - Allegations of inappropriate conduct
- Submit completed forms to Ministry Director immediately
- All incident reports are confidential and stored securely
    `
  },
  training: {
    id: 'training',
    title: 'Training & Development',
    icon: FiAward,
    color: '#db7093',
    content: `
## 6. Training & Development

- **Initial Training:**
  - All new volunteers must complete the Kidz Ministry orientation (2 hours)
  - Shadow an experienced volunteer for two services before serving independently
  - Complete online child safety training within 30 days of joining the team

- **Ongoing Development:**
  - Quarterly team training sessions (scheduled on weeknight evenings)
  - Annual all-team retreat (full day, typically in August)
  - Optional learning resources available through the app and ministry library

- **Leadership Development:**
  - After 6 months of consistent service, volunteers may apply for leadership roles
  - Leadership positions include: Room Leaders, Check-in Team Leaders, and Curriculum Coordinators
  - Leadership training provided for those transitioning to leadership roles
    `
  },
  appendix: {
    id: 'appendix',
    title: 'Appendix',
    icon: FiClipboard,
    color: '#8a2be2',
    content: `
## 7. Appendix

### 7.1 Age Group Specifics

- **Nursery (0-24 months):**
  - 1:3 adult to child ratio
  - Diaper changes only by approved female volunteers
  - Detailed feeding and nap instructions from parents

- **Toddlers (2-3 years):**
  - 1:5 adult to child ratio
  - Focus on play-based learning and short Bible stories
  - Potty training assistance as needed

- **Preschool (4-5 years):**
  - 1:8 adult to child ratio
  - More structured learning activities
  - Simple memory verses and songs

- **Elementary (K-5th Grade):**
  - 1:10 adult to child ratio
  - Age-appropriate small groups after large group teaching
  - Interactive games and activities related to the lesson

### 7.2 Resources & Forms

- All forms are available in the Kidz Ministry binder and app:
  - Incident Report Form
  - Special Needs Information Form
  - Allergy Alert Form
  - Volunteer Application
  - Room Leader Checklist

### 7.3 Contact Information

- **Kidz Ministry Director:** [Name, Phone, Email]
- **Family Pastor:** [Name, Phone, Email]
- **Church Office:** [Phone, Hours]
- **Emergency Services:** 911
    `
  }
};

const PolicyDetailPage: React.FC = () => {
  const { sectionId } = useParams<{sectionId?: string}>();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<any>(null);
  
  useEffect(() => {
    // Check if the sectionId is valid
    if (sectionId && policyContent[sectionId as keyof typeof policyContent]) {
      setPolicy(policyContent[sectionId as keyof typeof policyContent]);
    } else {
      // If no valid section, default to first policy
      setPolicy(policyContent.vision);
    }
  }, [sectionId]);

  const goBack = () => {
    // Go back to the previous page in history instead of always going home
    navigate(-1);
  };

  if (!policy) {
    return <div className="loading">Loading...</div>;
  }

  const IconComponent = policy.icon;

  return (
    <div className="policy-detail-page">
      <div className="policy-header" style={{ backgroundColor: policy.color + '15' /* 15% opacity */ }}>
        <button className="back-button" onClick={goBack}>
          <FiArrowLeft /> Back
        </button>
        <div className="title-container">
          <IconComponent size={36} color={policy.color} />
          <h1>{policy.title}</h1>
        </div>
      </div>
      
      <div className="policy-content">
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(policy.content) }}
        />
      </div>
    </div>
  );
};

// Simple markdown to HTML converter (would use a proper library in production)
function convertMarkdownToHTML(markdown: string): string {
  let html = markdown
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  
  // Wrap lists
  html = html.replace(/(<li>.+<\/li>\n)+/g, (match) => {
    return `<ul>${match}</ul>`;
  });
  
  // Add paragraphs
  html = html.replace(/^([^<].+)$/gm, '<p>$1</p>');
  
  // Fix multiple paragraphs
  html = html.replace(/<\/p>\n<p>/g, '</p><p>');
  
  return html;
}

export default PolicyDetailPage;
