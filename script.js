let chart;

// Fungsi untuk format input angka dengan separator ribuan otomatis
function formatNumberInput(input) {
  input.value = input.value.replace(/[^\d,]/g, ""); // hanya angka dan koma
  let parts = input.value.split(",");
  let number = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  input.value = number + (parts[1] ? "," + parts[1] : "");
}

// Terapkan format ke semua input numerik berbasis text
document.querySelectorAll("input[type='text']").forEach(input => {
  input.addEventListener("input", () => formatNumberInput(input));
});

// Parse angka dari input terformat
function parseNumber(value) {
  return Number(value.replace(/\./g, "").replace(",", ".")) || 0;
}

function hitung() {
  const pad = parseNumber(document.getElementById("pad").value) * 1_000_000;
  const dau = parseNumber(document.getElementById("dau").value) * 1_000_000;
  const dak = parseNumber(document.getElementById("dak").value) * 1_000_000;
  const dbh = parseNumber(document.getElementById("dbh").value) * 1_000_000;
  const belanja = parseNumber(document.getElementById("belanja").value) * 1_000_000;
  const pendapatan = parseNumber(document.getElementById("pendapatan").value) * 1_000_000;
  const temuan = Number(document.getElementById("temuan").value);
  const penduduk = parseNumber(document.getElementById("penduduk").value) * 1_000_000;
  const asn = parseNumber(document.getElementById("asn").value);
  const pdrb = parseNumber(document.getElementById("pdrb").value);
  const usia = Number(document.getElementById("usia").value);
  const jawa = Number(document.getElementById("jawa").value);
  const tipe = document.getElementById("tipe").value;

  const dummyKab = (tipe === "kabupaten") ? 1 : 0;
  const dummyKota = (tipe === "kota") ? 1 : 0;
  const totalTransfer = dau + dak + dbh;
  const rasio = belanja / pendapatan;

  // Estimasi Korupsi
  const estimasiKorupsiLn = 21.872
    - 0.039 * Math.log(pad)
    - 0.013 * Math.log(totalTransfer)
    + 0.094 * Math.log(rasio)
    - 0.038 * temuan
    + 0.036 * Math.log(penduduk)
    + 0.4 * Math.log(asn)
    + 0.005 * Math.log(pdrb)
    - 0.02 * usia
    - 0.377 * jawa
    - 0.525 * dummyKab
    - 0.63 * dummyKota;

  const estimasiKorupsi = Math.exp(estimasiKorupsiLn);

  // Estimasi IPM (tanpa anti log)
  const estimasiIpm =
    42.518
    + 0.155 * Math.log(pad)
    + 0.284 * Math.log(totalTransfer)
    + 2.803 * Math.log(rasio)
    - 0.052 * temuan
    - 0.55 * Math.log(estimasiKorupsi)
    + 0.333 * Math.log(penduduk)
    + 1.152 * Math.log(asn)
    + 0.027 * Math.log(pdrb)
    + 0.465 * usia
    + 0.027 * jawa
    + 0.435 * dummyKab
    + 9.678 * dummyKota;

  document.getElementById("hasilKorupsi").innerText =
    "Rp " + estimasiKorupsi.toLocaleString("id-ID", { maximumFractionDigits: 2 });
  document.getElementById("hasilIpm").innerText = estimasiIpm.toFixed(2);

  tampilkanGrafik(estimasiKorupsi, estimasiIpm);
}

function tampilkanGrafik(korupsi, ipm) {
  const ctx = document.getElementById("hasilChart").getContext("2d");

  const data = {
    labels: ["Estimasi Korupsi (Rp)", "Estimasi IPM (0–100)"],
    datasets: [{
      label: "Hasil Simulasi",
      data: [korupsi, ipm],
      backgroundColor: ["#1e88e5", "#43a047"],
      borderRadius: 8,
    }]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(korupsi, 100),
        ticks: {
          callback: function (value) {
            if (value > 1_000_000_000) return value / 1_000_000_000 + " M";
            if (value > 1_000_000) return value / 1_000_000 + " Jt";
            return value;
          }
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.parsed.y.toLocaleString("id-ID");
          }
        }
      }
    }
  };

  if (chart) {
    chart.data = data;
    chart.options = options;
    chart.update();
  } else {
    chart = new Chart(ctx, { type: "bar", data, options });
  }
}
