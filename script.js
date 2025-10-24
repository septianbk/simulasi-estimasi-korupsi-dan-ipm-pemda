function hitung() {
  const pad = Number(document.getElementById("pad").value);
  const dau = Number(document.getElementById("dau").value);
  const dak = Number(document.getElementById("dak").value);
  const dbh = Number(document.getElementById("dbh").value);
  const belanja = Number(document.getElementById("belanja").value);
  const pendapatan = Number(document.getElementById("pendapatan").value);
  const temuan = Number(document.getElementById("temuan").value);
  const penduduk = Number(document.getElementById("penduduk").value);
  const asn = Number(document.getElementById("asn").value);
  const pdrb = Number(document.getElementById("pdrb").value);
  const usia = Number(document.getElementById("usia").value);
  const jawa = Number(document.getElementById("jawa").value);
  const tipe = document.getElementById("tipe").value;

  const dummyKab = (tipe === "kabupaten") ? 1 : 0;
  const dummyKota = (tipe === "kota") ? 1 : 0;
  const totalTransfer = dau + dak + dbh;
  const rasio = belanja / pendapatan;

  // Rumus Estimasi Korupsi
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

  // Rumus Estimasi IPM
  const estimasiIpmLn = 42.518
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

  const estimasiIpm = Math.exp(estimasiIpmLn);

  document.getElementById("hasilKorupsi").innerText = estimasiKorupsi.toLocaleString("id-ID", { maximumFractionDigits: 2 });
  document.getElementById("hasilIpm").innerText = estimasiIpm.toFixed(2);
}
