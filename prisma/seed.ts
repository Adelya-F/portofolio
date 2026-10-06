import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { skills } from "./skills";
import { demoProjects } from "./projects-demo";

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
        title: "Kulkul",
        slug: "kulkul-extracuriculer",
        descriptionEn:
          "A platform for managing school extracurricular activities — member registration, attendance, and schedules in one place.",
        descriptionId:
          "Platform manajemen kegiatan ekstrakurikuler sekolah — pendaftaran anggota, presensi, dan jadwal jadi satu tempat.",
        imageUrl: "/images/projects/kulkul.jpeg",
        tags: ["DevOps", "Docker", "CI/CD", "Linux", "Cloud Deployment"],
        featured: false,
        order: 1,
      },
      {
        title: "Averus",
        slug: "averus",
        descriptionEn:
          "A learning management system built with Averus, a tutoring institution — course materials, schedules, and student progress in one place.",
        descriptionId:
          "Learning management system yang dibangun bersama Averus, lembaga bimbingan belajar — materi, jadwal, dan progres siswa jadi satu tempat.",
        imageUrl: "/images/projects/averus1.png",
        tags: ["DevOps", "Laravel", "PHP", "MySQL", "Bootstrap / CSS"],
        featured: false,
        order: 2,
      },
      ...demoProjects,
    ],
  });

  await prisma.skill.createMany({ data: skills });

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
