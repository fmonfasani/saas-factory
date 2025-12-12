const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const blueprints = [
    {
        slug: 'task-manager',
        name: 'Task Manager',
        description: 'Gestión de tareas y proyectos para equipos y freelancers',
        category: 'productivity',
        icon: '✅',
        difficulty: 'beginner',
        estimatedTime: '2 hours',
        defaultFeatures: ['Kanban Board', 'Due Dates', 'Team Collaboration', 'Notifications', 'Labels & Tags', 'File Attachments'],
        suggestedStack: ['React', 'Node.js', 'PostgreSQL', 'Socket.io'],
        promptTemplate: 'Create a task management SaaS for {{market}} with features like {{features}}'
    },
    {
        slug: 'invoice-generator',
        name: 'Invoice Generator',
        description: 'Crea, envía y rastrea facturas profesionales',
        category: 'business',
        icon: '💰',
        difficulty: 'intermediate',
        estimatedTime: '4 hours',
        defaultFeatures: ['PDF Export', 'Client Management', 'Payment Tracking', 'Templates', 'Recurring Invoices', 'Tax Calculation'],
        suggestedStack: ['Next.js', 'Node.js', 'Stripe', 'PDF Generator'],
        promptTemplate: 'Create an invoice management SaaS for {{market}} with billing features'
    },
    {
        slug: 'social-scheduler',
        name: 'Social Media Scheduler',
        description: 'Programa y publica contenido en múltiples redes sociales',
        category: 'content',
        icon: '📱',
        difficulty: 'intermediate',
        estimatedTime: '6 hours',
        defaultFeatures: ['Multi-Platform', 'Analytics', 'Queue Management', 'Best Time to Post', 'Content Calendar', 'Team Collaboration'],
        suggestedStack: ['React', 'Node.js', 'Redis', 'Social APIs'],
        promptTemplate: 'Create a social media scheduling SaaS for {{market}}'
    },
    {
        slug: 'ai-chatbot',
        name: 'AI Chatbot Builder',
        description: 'Crea chatbots inteligentes para soporte y ventas',
        category: 'ai',
        icon: '🤖',
        difficulty: 'advanced',
        estimatedTime: '8 hours',
        defaultFeatures: ['Natural Language', 'Custom Training', 'Analytics', 'Widget Embeddable', 'Multi-language', 'Integration APIs'],
        suggestedStack: ['React', 'Node.js', 'OpenAI', 'WebSocket'],
        promptTemplate: 'Create an AI-powered chatbot builder for {{market}}'
    },
    {
        slug: 'booking-system',
        name: 'Booking & Appointments',
        description: 'Sistema de reservas y citas online',
        category: 'business',
        icon: '📅',
        difficulty: 'beginner',
        estimatedTime: '3 hours',
        defaultFeatures: ['Calendar Sync', 'Reminders', 'Payment Integration', 'Availability Management', 'Client Portal', 'Zoom Integration'],
        suggestedStack: ['Next.js', 'Node.js', 'Google Calendar API', 'Stripe'],
        promptTemplate: 'Create a booking and appointment scheduling SaaS for {{market}}'
    },
    {
        slug: 'email-marketing',
        name: 'Email Marketing',
        description: 'Campañas de email marketing con automatización',
        category: 'marketing',
        icon: '📧',
        difficulty: 'intermediate',
        estimatedTime: '5 hours',
        defaultFeatures: ['Drag & Drop Editor', 'Automation', 'A/B Testing', 'Analytics', 'Segmentation', 'Templates'],
        suggestedStack: ['React', 'Node.js', 'SendGrid', 'Redis'],
        promptTemplate: 'Create an email marketing SaaS for {{market}}'
    },
    {
        slug: 'crm-lite',
        name: 'CRM Lite',
        description: 'Gestión de clientes y pipeline de ventas simplificado',
        category: 'business',
        icon: '👥',
        difficulty: 'intermediate',
        estimatedTime: '5 hours',
        defaultFeatures: ['Contact Management', 'Pipeline View', 'Deal Tracking', 'Activity Log', 'Email Integration', 'Reports'],
        suggestedStack: ['React', 'Node.js', 'PostgreSQL', 'Chart.js'],
        promptTemplate: 'Create a lightweight CRM for {{market}}'
    },
    {
        slug: 'form-builder',
        name: 'Form Builder',
        description: 'Crea formularios y encuestas sin código',
        category: 'productivity',
        icon: '📝',
        difficulty: 'beginner',
        estimatedTime: '2 hours',
        defaultFeatures: ['Drag & Drop', 'Conditional Logic', 'Integrations', 'Analytics', 'Templates', 'Embed Widget'],
        suggestedStack: ['React', 'Node.js', 'MongoDB', 'Webhooks'],
        promptTemplate: 'Create a no-code form builder for {{market}}'
    }
];

async function seed() {
    console.log('🌱 Seeding blueprints...');

    for (const blueprint of blueprints) {
        const existing = await prisma.blueprint.findUnique({
            where: { slug: blueprint.slug }
        });

        if (existing) {
            console.log(`  ⏭️  Skipping ${blueprint.name} (already exists)`);
            continue;
        }

        await prisma.blueprint.create({
            data: blueprint
        });
        console.log(`  ✅ Created ${blueprint.name}`);
    }

    console.log('✨ Seeding completed!');
}

seed()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
