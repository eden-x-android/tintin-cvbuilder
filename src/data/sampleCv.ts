import type { CvData } from '../types/cv';
import { createId } from '../utils/cvIds';

const meta = (key: string, value: string) => ({ id: createId(), key, value });

// Dữ liệu giả, cùng cấu trúc và độ dài với dữ liệu trong bản thiết kế, để preview trông đúng bố cục.
export const createSampleCv = (): CvData => ({
    personal: {
        fullName: 'Nguyễn Văn An',
        title: 'Quality Control',
        dateOfBirth: 'March 12, 2000',
        email: 'an.nguyen@example.com',
        phone: '0900 000 000',
        location: 'Thu Duc City, Ho Chi Minh',
        linkedin: {
            label: 'Linkedin',
            url: 'https://www.linkedin.com/in/an-nguyen-example/',
        },
        photo: null,
    },
    objective: {
        shortTerm: {
            label: 'Short term (Next 2 years)',
            text: null,
            items: [
                'Maintain good performance & get higher job rank',
                'Achieve more certificates of Software testing.',
            ],
        },
        longTerm: {
            label: 'Long term (Next 5 years)',
            text: 'Strive to become a QC Lead with deeper experience & professionalism to contribute to the company.',
            items: [],
        },
    },
    summary: {
        heading: 'General',
        items: [
            'Over 2 years of hands-on experience in the QA/QC field with solid knowledge of the SDLC (Agile & Waterfall).',
            'Experienced in performance testing, helping cut production bugs significantly.',
            'Designed and executed test cases for core business workflows, covering both happy paths and alternative cases.',
            'Detail-oriented, adaptable, and proactive, with strong problem-solving and collaboration skills.',
        ],
    },
    skills: [
        {
            id: createId(),
            category: 'Testing',
            items: ['Manual Test', 'SQL', 'API Testing', 'Performance testing', 'Security Testing'],
        },
        {
            id: createId(),
            category: 'Computer',
            items: ['Jira', 'Azure DevOps', 'Postman', 'JMeter', 'OWASP ZAP'],
        },
    ],
    experience: [
        {
            id: createId(),
            company: 'Example Solutions',
            role: 'QA/QC',
            startDate: '2024-06',
            endDate: 'present',
            responsibilities: [
                'Ensure quality of all projects before handing over to customers',
                "Analyze customer's requirements to design & update test cases",
                'Execute test cases & log bugs on the management tool',
                'Work with developers to analyze & find root causes of bugs',
                'Demo & report to manager each sprint',
            ],
            pageBreakAfter: false,
        },
        {
            id: createId(),
            company: 'Sample Digital',
            role: 'QC Manual',
            startDate: '2023-05',
            endDate: '2024-05',
            responsibilities: [
                'Learn and practice SQL, API testing with [Postman](https://www.postman.com)',
                'Create test design, test cases, test reports and test plans',
                'Execute tests and log bugs on Jira',
            ],
            pageBreakAfter: false,
        },
    ],
    projects: [
        {
            id: createId(),
            name: 'Procurement Platform',
            meta: [meta('Platform', 'Website & Mobile App'), meta('SDLC', 'Agile/Scrum')],
            overview: 'An all-in-one solution that simplifies the purchasing workflow: suppliers, purchase requests, bidding, orders, contracts and budgets.',
            responsibilities: [
                'Analyze business requirements related to creating and approving purchase requests.',
                'Write detailed test cases and test scenarios for each subsystem.',
                'Manual testing on UAT and staging, regression testing after each update.',
            ],
            achievement: 'Released product to customer with good feedback.',
            pageBreakAfter: false,
        },
        {
            id: createId(),
            name: 'Fleet Tracker',
            meta: [meta('Platform', 'Website & Mobile App'), meta('OS', 'iOS & Android'), meta('SDLC', 'Agile/Scrum')],
            overview: 'Optimizes trip dispatching, vehicle tracking, route management and fuel cost analysis.',
            responsibilities: [],
            achievement: null,
            pageBreakAfter: false,
        },
        {
            id: createId(),
            name: 'Goal Challenge',
            meta: [meta('Platform', 'Mobile App'), meta('OS', 'iOS & Android')],
            overview: 'A mobile app for users to create challenges with a deadline and goal.',
            responsibilities: [],
            achievement: null,
            pageBreakAfter: false,
        },
    ],
    education: [
        {
            id: createId(),
            startYear: '2018',
            endYear: '2022',
            school: 'University of Example',
            major: 'Management Information System (MIS)',
            gpa: '3.20/4',
        },
    ],
    certifications: [
        { id: createId(), year: '2022', name: 'Microsoft Excel: Basic to Advance', issuer: null },
        { id: createId(), year: '2023', name: 'ISTQB Foundation', issuer: 'Udemy' },
    ],
    references: [
        {
            id: createId(),
            name: 'Mr. Tran Minh Khoa',
            position: 'Team Lead of Sample Digital',
            email: 'khoa@example.com',
        },
    ],
    sectionBreaks: {
        summary: false,
        objective: false,
        skills: false,
        experience: false,
        projects: false,
        footer: false,
    },
});
