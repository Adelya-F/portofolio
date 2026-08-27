/**
 * Two showcase projects that ship with the site so the Projects rail has
 * something to scroll. They are product concepts with hand-drawn UI mockups in
 * public/images/projects/ — edit or delete them from the admin dashboard.
 */
export const demoProjects = [
  {
    title: "Sellsonar",
    slug: "sellsonar",
    descriptionEn:
      "A real-time dashboard for marketplace operators — live GMV, anomaly detection, and a seller leaderboard as events happen.",
    descriptionId:
      "Dashboard real-time untuk operator marketplace — GMV live, deteksi anomali, dan papan peringkat seller saat event terjadi.",
    imageUrl: "/images/projects/sellsonar-dashboard.svg",
    tags: [
      "Python",
      "AWS Kinesis",
      "AWS Glue",
      "Amazon Redshift",
      "AWS Lambda",
      "Next.js",
    ],
    demoUrl: null,
    repoUrl: null,
    featured: false,
    order: 3,
  },
  {
    title: "StockScan",
    slug: "stockscan",
    descriptionEn:
      "An offline-first stock-take app for warehouses — scan, count, and sync automatically once signal returns.",
    descriptionId:
      "Aplikasi stock opname offline-first untuk gudang — scan, hitung, dan sinkron otomatis begitu sinyal kembali.",
    imageUrl: "/images/projects/stockscan-app.svg",
    tags: ["Flutter", "Dart", "SQLite", "Firebase", "REST API", "Android"],
    demoUrl: null,
    repoUrl: null,
    featured: false,
    order: 4,
  },
];
