import { PrismaClient, ApplicationStatus, RoundType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  await prisma.interviewRound.deleteMany();
  await prisma.applicationNote.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Demo@1234', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@careora.app',
      name: 'Demo User',
      passwordHash,
    },
  });

  console.log(`Created user: ${user.email}`);

  const sampleJobs = [
    { company: 'Google', role: 'Software Engineer', status: ApplicationStatus.OFFER },
    { company: 'Meta', role: 'Frontend Developer', status: ApplicationStatus.INTERVIEW },
    { company: 'Amazon', role: 'Full Stack Engineer', status: ApplicationStatus.REJECTED },
    { company: 'Netflix', role: 'Senior Software Engineer', status: ApplicationStatus.PHONE_SCREEN },
    { company: 'Apple', role: 'UI Engineer', status: ApplicationStatus.APPLIED },
    { company: 'Microsoft', role: 'Software Engineer II', status: ApplicationStatus.WISHLIST },
    { company: 'Stripe', role: 'Frontend Engineer', status: ApplicationStatus.INTERVIEW },
    { company: 'Vercel', role: 'Developer Advocate', status: ApplicationStatus.WITHDRAWN },
    { company: 'Notion', role: 'Product Engineer', status: ApplicationStatus.APPLIED },
    { company: 'Linear', role: 'Software Engineer', status: ApplicationStatus.WISHLIST },
  ];

  for (let i = 0; i < sampleJobs.length; i++) {
    const jobData = sampleJobs[i];
    
    const appliedDate = new Date();
    appliedDate.setDate(appliedDate.getDate() - (i % 14));

    const job = await prisma.job.create({
      data: {
        userId: user.id,
        company: jobData.company,
        role: jobData.role,
        location: 'Remote',
        salary: '$120k - $150k',
        applications: {
          create: {
            userId: user.id,
            status: jobData.status,
            appliedAt: jobData.status !== ApplicationStatus.WISHLIST ? appliedDate : null,
            source: 'LinkedIn',
            notes: `Applied through their careers page for the ${jobData.role} role.`,
            appNotes: {
              create: [
                { content: 'Found this job on LinkedIn.' },
                { content: 'Need to follow up next week.' }
              ]
            },
            ...(jobData.status === ApplicationStatus.INTERVIEW || jobData.status === ApplicationStatus.OFFER ? {
              interviews: {
                create: [
                  {
                    roundType: RoundType.PHONE,
                    scheduledAt: new Date(appliedDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days after apply
                    outcome: 'Passed',
                    notes: 'Recruiter was nice. Moving to technical round.'
                  }
                ]
              }
            } : {})
          }
        }
      }
    });
    console.log(`Created job + application for ${jobData.company}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
