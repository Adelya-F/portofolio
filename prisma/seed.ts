import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.achievement.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();

  await prisma.achievement.createMany({
    data: [
      {
        title: "Cloud Computing",
        level: "NATIONAL",
        competition: "LKSN (Lomba Kompetensi Siswa Nasional)",
        year: 2026,
        order: 1,
      },
      {
        title: "Cloud Computing",
        level: "PROVINCIAL",
        competition: "LKSN (Lomba Kompetensi Siswa Nasional)",
        year: 2025,
        order: 2,
      },
      {
        title: "Cloud Computing",
        level: "CITY",
        competition: "LKSN (Lomba Kompetensi Siswa Nasional)",
        year: 2025,
        order: 3,
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        title: "LKSN Cloud Computing Project",
        slug: "lksn-cloud-computing-project",
        descriptionEn:
          "The build that took me to 1st place nationally. I provisioned everything as code with Terraform, then containerized and orchestrated the workloads with Docker and Kubernetes on AWS. Competition conditions meant things broke in front of a clock, so a good chunk of this project was really about staying calm and troubleshooting infrastructure fast, not just building it.",
        descriptionId:
          "Project yang bawa saya ke Juara 1 Nasional. Semua saya provisioning sebagai code pakai Terraform, lalu containerization dan orchestration workload-nya dengan Docker dan Kubernetes di AWS. Namanya kondisi kompetisi, ya pasti ada aja yang error sambil waktu terus jalan — jadi sebagian besar project ini sebenarnya soal tetap tenang dan troubleshooting infrastruktur dengan cepat, bukan cuma soal membangunnya.",
        tags: [
          "Terraform",
          "Docker",
          "Kubernetes",
          "AWS (EC2, S3, VPC)",
          "Infrastructure as Code",
          "Cloud Computing",
        ],
        featured: true,
        order: 1,
      },
      {
        title: "Home Industry Tutoring ('Bimbel') Website",
        slug: "home-industry-tutoring-website",
        descriptionEn:
          "A website for a small, home-run tutoring business, built with a couple of teammates. I ended up owning both the backend and the frontend, which meant a lot of context-switching between Laravel logic and making the UI actually feel usable for non-technical users.",
        descriptionId:
          "Website untuk usaha bimbel kecil skala home industry, dikerjakan bareng beberapa teman satu tim. Saya akhirnya pegang backend sekaligus frontend, jadi lumayan sering bolak-balik antara logika Laravel dan bikin tampilan yang benar-benar nyaman dipakai orang awam.",
        tags: ["Laravel", "PHP", "MySQL", "Bootstrap / CSS"],
        featured: false,
        order: 2,
      },
    ],
  });

  await prisma.skill.createMany({
    data: [
      { name: "AWS (EC2, S3, VPC & more)", category: "Cloud Computing & Infrastructure", level: "ADVANCED", order: 1 },
      { name: "Terraform", category: "Cloud Computing & Infrastructure", level: "ADVANCED", order: 2 },
      { name: "Docker", category: "Cloud Computing & Infrastructure", level: "ADVANCED", order: 3 },
      { name: "Kubernetes", category: "Cloud Computing & Infrastructure", level: "ADVANCED", order: 4 },
      { name: "Infrastructure as Code", category: "Cloud Computing & Infrastructure", level: "ADVANCED", order: 5 },
      { name: "Infrastructure Troubleshooting", category: "Cloud Computing & Infrastructure", level: "ADVANCED", order: 6 },
      { name: "Linux", category: "Cloud Computing & Infrastructure", level: "ADVANCED", order: 7 },
      { name: "Networking Fundamentals", category: "Cloud Computing & Infrastructure", level: "INTERMEDIATE", order: 8 },
      { name: "Laravel", category: "Backend", level: "INTERMEDIATE", order: 9 },
      { name: "PHP", category: "Backend", level: "INTERMEDIATE", order: 10 },
      { name: "MySQL", category: "Backend", level: "INTERMEDIATE", order: 11 },
      { name: "HTML", category: "Web Development", level: "INTERMEDIATE", order: 12 },
      { name: "CSS", category: "Web Development", level: "INTERMEDIATE", order: 13 },
      { name: "JavaScript", category: "Web Development", level: "INTERMEDIATE", order: 14 },
      { name: "Git & GitHub", category: "Tools", level: "INTERMEDIATE", order: 15 },
      { name: "CI/CD (GitHub Actions)", category: "Tools", level: "BASIC", order: 16 },
    ],
  });

  await prisma.experience.createMany({
    data: [
      {
        title: "1st Place, National — LKSN Cloud Computing",
        organization: "Lomba Kompetensi Siswa Nasional (LKSN)",
        date: "Feb 2026 (placeholder — update with exact date) — Present",
        descriptionEn:
          "Took 1st place nationally, building and troubleshooting cloud infrastructure with Terraform, Docker, Kubernetes, and AWS while the clock was running.",
        descriptionId:
          "Meraih Juara 1 tingkat nasional, membangun sekaligus troubleshooting infrastruktur cloud dengan Terraform, Docker, Kubernetes, dan AWS sambil waktu terus berjalan.",
        order: 1,
      },
      {
        title: "1st Place, Provincial — LKSN Cloud Computing",
        organization: "Lomba Kompetensi Siswa Nasional (LKSN)",
        date: "Oct 2025 (placeholder — update with exact date)",
        descriptionEn: "Won the provincial round, which is what earned me a shot at nationals.",
        descriptionId: "Menang di tingkat provinsi, yang jadi tiket saya ke babak nasional.",
        order: 2,
      },
      {
        title: "1st Place, City — LKSN Cloud Computing",
        organization: "Lomba Kompetensi Siswa Nasional (LKSN)",
        date: "Jun 2025 (placeholder — update with exact date)",
        descriptionEn: "Where it all started — 1st place at the city level, and the qualifier for the provincial round.",
        descriptionId: "Titik awalnya — Juara 1 tingkat kota, sekaligus kualifikasi ke babak provinsi.",
        order: 3,
      },
      {
        title: "Team Developer — Home Industry Tutoring Website",
        organization: "Independent team project",
        date: "Sep – Dec 2024 (placeholder — update with exact dates)",
        descriptionEn:
          "Built a website for a home-industry tutoring business with a small team, covering both backend and frontend with Laravel.",
        descriptionId:
          "Membangun website untuk usaha bimbel home industry bersama tim kecil, pegang backend dan frontend-nya pakai Laravel.",
        order: 4,
      },
    ],
  });

  // BlogPost intentionally left empty — no seed data yet (Phase 1 decision).

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
