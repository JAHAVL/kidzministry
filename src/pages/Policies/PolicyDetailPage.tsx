import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiShield, FiHeart, FiMessageCircle, FiAward, FiClipboard } from 'react-icons/fi';
import { POLICY_DATA, Policy } from '../../data/policyData';
import { useTheme } from '../../context/ThemeContext';
import './PolicyDetailPage.css';

// Map policy categories to icons and colors for visual representation
const categoryIcons: Record<string, { icon: React.ElementType, color: string }> = {
  'Vision': { icon: FiBookOpen, color: '#8a2be2' },
  'Team Guidelines': { icon: FiUsers, color: '#4169e1' },
  'Safety Policies': { icon: FiShield, color: '#db7093' },
  'Behavior Guidelines': { icon: FiHeart, color: '#8a2be2' },
  'Communication': { icon: FiMessageCircle, color: '#4169e1' },
  'Training': { icon: FiAward, color: '#db7093' },
  'Appendix': { icon: FiClipboard, color: '#8a2be2' }
};

// Default category/icon mapping when a specific mapping is not found
const defaultIcon = { icon: FiBookOpen, color: '#4169e1' };

// Utility function to convert hex color to RGB format
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '65, 105, 225'; // Default fallback
};

const PolicyDetailPage: React.FC = () => {
  const { sectionId } = useParams<{sectionId?: string}>();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const { darkMode } = useTheme();
  
  // The checklist items are now directly integrated into the markdown content
  
  // Keep track of which checklist items are checked
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>({});
  
  // Load checklist state from localStorage
  useEffect(() => {
    if (sectionId === 'team-guidelines') {
      try {
        const savedState = localStorage.getItem('team-guidelines-checklist');
        if (savedState) {
          setCheckedItems(JSON.parse(savedState));
        }
      } catch (error) {
        console.error('Error loading checklist state:', error);
      }
    }
  }, [sectionId]);
  
  // Save checklist state to localStorage when it changes
  useEffect(() => {
    if (sectionId === 'team-guidelines' && Object.keys(checkedItems).length > 0) {
      localStorage.setItem('team-guidelines-checklist', JSON.stringify(checkedItems));
    }
  }, [checkedItems, sectionId]);
  
  // Effect to handle policy data fetching
  
  useEffect(() => {
    console.log('Looking for policy with sectionId:', sectionId);
    console.log('Available policy IDs:', POLICY_DATA.map(p => p.id));
    
    // Find the policy that matches the sectionId
    if (sectionId) {
      const foundPolicy = POLICY_DATA.find(p => p.id === sectionId);
      console.log('Found policy:', foundPolicy?.title || 'None found');
      
      if (foundPolicy) {
        setPolicy(foundPolicy);
        return;
      } else {
        // If specific ID not found, try to identify the requested policy by title or category
        console.log('Attempting to find policy by title or category containing:', sectionId);
        const altPolicy = POLICY_DATA.find(p => 
          p.title.toLowerCase().includes(sectionId.toLowerCase()) ||
          p.category.toLowerCase().includes(sectionId.toLowerCase())
        );
        
        if (altPolicy) {
          console.log('Found alternative policy match by title/category:', altPolicy.title);
          setPolicy(altPolicy);
          return;
        }
      }
    }
    
    // If no valid section or no sectionId, default to first policy
    console.log('Defaulting to first policy:', POLICY_DATA[0].title);
    setPolicy(POLICY_DATA[0]);
  }, [sectionId]);

  const goBack = () => {
    // Go back to the previous page in history instead of always going home
    navigate(-1);
  };

  if (!policy) {
    return <div className="loading">Loading...</div>;
  }

  // Get the icon for this policy's category, or use default if not found
  const iconInfo = policy.category && categoryIcons[policy.category] 
                   ? categoryIcons[policy.category] 
                   : defaultIcon;

  return (
    <div className="policy-detail-page" data-theme={darkMode ? 'dark' : 'light'}>
      <div
        className="policy-header"
        style={{
          backgroundColor: darkMode ? 'rgba(40, 40, 40, 0.8)' : `rgba(${
            parseInt(iconInfo.color.slice(1, 3), 16)
          }, ${parseInt(iconInfo.color.slice(3, 5), 16)}, ${
            parseInt(iconInfo.color.slice(5, 7), 16)
          }, 0.1)`
        }}
      >
        <div className="back-button" onClick={goBack}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back
        </div>
        <div className="title-container">
          <div className="policy-icon" style={{ backgroundColor: 'transparent' }}>
            {React.createElement(iconInfo.icon, { size: 24, color: iconInfo.color })}
          </div>
          <h1>{policy.title}</h1>
        </div>
      </div>
      
      <div className="policy-content" data-theme={darkMode ? 'dark' : 'light'}>
        <div className="policy-summary" style={{ borderLeftColor: iconInfo.color }}>
          <p>{policy.summary}</p>
        </div>
        {policy?.id === 'team-guidelines' ? (
          <div 
            className="markdown-content"
            ref={(el) => {
              if (el) {
                // Apply the theme color and its RGB equivalent for CSS variables
                el.style.setProperty('--theme-color', iconInfo.color);
                el.style.setProperty('--theme-color-rgb', hexToRgb(iconInfo.color));
                
                // Add event listeners to checkboxes with a slight delay to ensure DOM is ready
                setTimeout(() => {
                  const checkboxes = el.querySelectorAll('.requirement-checkbox');
                  
                  // Load saved states from localStorage
                  try {
                    const savedState = localStorage.getItem('team-guidelines-checklist');
                    if (savedState) {
                      const checkedItems = JSON.parse(savedState);
                      checkboxes.forEach((checkbox) => {
                        const input = checkbox as HTMLInputElement;
                        if (checkedItems[input.id]) {
                          input.checked = true;
                        }
                      });
                    }
                  } catch (error) {
                    console.error('Error loading checklist state:', error);
                  }
                  
                  // Add change event listeners to save state
                  checkboxes.forEach((checkbox) => {
                    const input = checkbox as HTMLInputElement;
                    input.addEventListener('change', () => {
                      // Save all checkbox states to localStorage
                      const newState: {[key: string]: boolean} = {};
                      checkboxes.forEach((cb) => {
                        const input = cb as HTMLInputElement;
                        newState[input.id] = input.checked;
                      });
                      localStorage.setItem('team-guidelines-checklist', JSON.stringify(newState));
                    });
                  });
                }, 100);
              }
            }}
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(policy.content) }}
          />
        ) : (
          <div 
            className="markdown-content"
            ref={(el) => {
              if (el) {
                // Apply the theme color and its RGB equivalent for CSS variables
                el.style.setProperty('--theme-color', iconInfo.color);
                el.style.setProperty('--theme-color-rgb', hexToRgb(iconInfo.color));
              }
            }}
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(policy.content) }}
          />
        )}
      </div>
    </div>
  );
};

// Enhanced markdown to HTML converter with better formatting and symbol handling
function convertMarkdownToHTML(markdown: string): string {
  if (!markdown) return '';
  
  // Step 1: Normalize and clean the input
  // Remove leading/trailing whitespace and normalize line endings
  let processedMarkdown = markdown.trim().replace(/\r\n/g, '\n');
  
  // Remove extra indentation from the entire text block (common in template literals)
  const lines = processedMarkdown.split('\n');
  const indentMatch = lines.filter(line => line.trim()).map(line => {
    const match = line.match(/^\s+/);
    return match ? match[0].length : 0;
  });
  
  // Find the minimum common indentation to remove
  const minIndent = Math.min(...indentMatch.filter(indent => indent > 0)) || 0;
  
  if (minIndent > 0) {
    processedMarkdown = lines.map(line => {
      if (line.trim() === '') return '';
      return line.substring(minIndent);
    }).join('\n');
  }

  // Step 2: Process the markdown in the correct order
  let html = processedMarkdown;

  // Special handling for Volunteer Requirements section in Team Guidelines
  if (markdown.includes('### 2.1 Volunteer Requirements')) {
    const requirementsRegex = /### 2\.1 Volunteer Requirements\s*([\s\S]+?)(?=###|$)/;
    const requirementsMatch = markdown.match(requirementsRegex);
    
    if (requirementsMatch && requirementsMatch[1]) {
      // Get the requirement list items
      const reqSection = requirementsMatch[1];
      const listItems = reqSection.match(/- (.+)$/gm);
      
      if (listItems) {
        let checklistHTML = '<h3 class="policy-subsection-title">2.1 Volunteer Requirements</h3>\n';
        checklistHTML += '<div class="volunteer-checklist">\n';
        
        // Transform the regular list items into checkbox items
        listItems.forEach((item, index) => {
          // Remove the bullet point and any square brackets from the text
          let itemText = item.replace(/^- /, '').trim();
          // Remove square brackets if present (e.g., [x] or [ ])
          itemText = itemText.replace(/\[\s*[xX]?\s*\]\s*/, '').trim();
          
          const itemId = `volunteer-req-${index}`;
          
          // Use a div instead of a li to avoid any default bullet styling
          checklistHTML += `  <div class="checklist-item" data-id="${itemId}">
`;
          checklistHTML += `    <label class="checklist-label">
`;
          checklistHTML += `      <input type="checkbox" class="requirement-checkbox" id="${itemId}" />
`;
          checklistHTML += `      <span class="checkbox-custom"></span>
`;
          checklistHTML += `      <span class="item-text">${itemText}</span>
`;
          checklistHTML += `    </label>
`;
          checklistHTML += `  </div>
`;
        });
        
        checklistHTML += '</div>\n';
        
        // Replace the Volunteer Requirements section with our enhanced checklist
        html = html.replace(requirementsRegex, checklistHTML);
      }
    }
  }

  // Step 3: Process special formats and sections
  
  // Handle headers - must come first to avoid conflicting with other formatting
  html = html
    // Make section titles look nice with proper HTML hierarchy
    .replace(/^## ([^#\n]+)$/gm, '<h2 class="policy-section-title">$1</h2>')
    .replace(/^### ([^#\n]+)$/gm, '<h3 class="policy-subsection-title">$1</h3>')
    .replace(/^#### ([^#\n]+)$/gm, '<h4 class="policy-paragraph-title">$1</h4>')
    .replace(/^# ([^#\n]+)$/gm, '<h1 class="policy-main-title">$1</h1>');

  // Format task list items (checkboxes)
  html = html.replace(/- \[ \] (.+)$/gm, '<div class="task-item unchecked"><span class="checkbox"></span>$1</div>');
  html = html.replace(/- \[x\] (.+)$/gm, '<div class="task-item checked"><span class="checkbox"></span>$1</div>');
  
  // Handle text formatting
  html = html
    // Bold
    .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    // Underline - using custom underline class for better control
    .replace(/\_\_([^_]+?)\_\_/g, '<span class="underline">$1</span>')
    // Strikethrough
    .replace(/~~([^~]+?)~~/g, '<span class="strikethrough">$1</span>');
  
  // Handle lists - improve detection of bullet points and numbered items
  
  // First, handle indented bullet lists with nice formatting and nesting support
  html = html.replace(/^(\s*)- (.+)$/gm, (_, indent, content) => {
    const indentLevel = Math.floor(indent.length / 2); // Every 2 spaces = one indent level
    const className = indentLevel > 0 ? ` data-indent="${indentLevel}"` : '';
    return `<li${className}>${content.trim()}</li>`;
  });
  
  // Handle numbered lists with consistent styling
  html = html.replace(/^(\s*)\d+\. (.+)$/gm, (_, indent, content) => {
    const indentLevel = Math.floor(indent.length / 2);
    const className = indentLevel > 0 ? ` data-indent="${indentLevel}"` : '';
    return `<li${className} class="ordered-list-item">${content.trim()}</li>`;
  });
  
  // Wrap lists properly
  // Unordered lists
  html = html.replace(/(<li(?:\s+data-indent="\d+")?(?!\s+class="ordered-list-item")>.+<\/li>\n?)+/gs, (match) => {
    return `<ul class="policy-list">\n${match}\n</ul>`;
  });
  
  // Ordered lists - wrap these separately
  html = html.replace(/(<li(?:\s+data-indent="\d+")?\s+class="ordered-list-item">.+<\/li>\n?)+/gs, (match) => {
    return `<ol class="policy-ordered-list">\n${match}\n</ol>`;
  });

  // Format highlighted sections with special styling
  html = html.replace(/\[!NOTE\]\s*\n?(.+?)(?=\n\n|$)/gs, '<div class="note-box">$1</div>');
  html = html.replace(/\[!IMPORTANT\]\s*\n?(.+?)(?=\n\n|$)/gs, '<div class="important-box">$1</div>');
  
  // Process links with proper styling
  html = html.replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '<a href="$2" class="policy-link" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Format code blocks and inline code
  html = html.replace(/```([\s\S]+?)```/g, '<pre class="code-block"><code>$1</code></pre>');
  html = html.replace(/`([^`]+?)`/g, '<code class="inline-code">$1</code>');
  
  // Handle horizontal rules
  html = html.replace(/^---+$/gm, '<hr class="policy-divider" />');
  
  // Handle tables if present
  // Table header row
  html = html.replace(/\|(.+?)\|\s*\n\|\s*[-:\s]+?\|\s*\n/g, (_, headerRow) => {
    const headers = headerRow.split('|').map((cell: string) => cell.trim()).filter(Boolean);
    const headerCells = headers.map((header: string) => `<th>${header}</th>`).join('');
    return `<table class="policy-table">\n<thead>\n<tr>${headerCells}</tr>\n</thead>\n<tbody>\n`;
  });
  
  // Table rows
  html = html.replace(/\|(.+?)\|/g, (_, rowContent) => {
    if (rowContent.includes('--') || rowContent.includes(':-')) return ''; // Skip delimiter row
    const cells = rowContent.split('|').map((cell: string) => cell.trim()).filter(Boolean);
    const cellElements = cells.map((cell: string) => `<td>${cell}</td>`).join('');
    return `<tr>${cellElements}</tr>`;
  });
  
  // Close any open tables
  if (html.includes('<table')) {
    html = html.replace(/(<\/tr>)(?!.*<\/tr>.*<\/tbody>).*$/s, '$1\n</tbody>\n</table>');
  }
  
  // Handle blockquotes
  html = html.replace(/^>\s*(.+)$/gm, '<blockquote class="policy-quote">$1</blockquote>');
  
  // Clean up and add paragraphs to remaining text that isn't already in HTML tags
  // We want to be selective about paragraphs to avoid breaking existing HTML
  // This is a more careful approach that won't remove any content
  let htmlLines = html.split('\n');
  for (let i = 0; i < htmlLines.length; i++) {
    const line = htmlLines[i].trim();
    if (line && !line.startsWith('<') && !line.endsWith('>')) {
      // This is plain text that needs paragraphs
      htmlLines[i] = `<p>${htmlLines[i]}</p>`;
    }
  }
  html = htmlLines.join('\n');
  
  // Clean up multiple newlines to avoid unnecessary spacing
  html = html
    .replace(/\n\n+/g, '\n\n')  // Multiple blank lines to one
    .replace(/>\n\n</g, '>\n<');  // Remove blank lines between adjacent HTML tags
  
  return html;
}

export default PolicyDetailPage;
