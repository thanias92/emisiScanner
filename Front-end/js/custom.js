// Fungsi untuk membuka/tutup navigasi
function openNav() {
  document.getElementById("myNav").classList.toggle("menu_width");
  document.querySelector(".custom_menu-btn").classList.toggle("menu_btn-style");
}

// Inisialisasi carousel OwlCarousel
$(".owl-carousel").owlCarousel({
  loop: true,
  margin: 20,
  nav: true,
  navText: [],
  autoplay: true,
  autoplayHoverPause: true,
  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 2,
    },
    1000: {
      items: 3,
    },
  },
});

// Fungsi untuk menangani unggahan gambar dan panggilan API
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0]; // Ambil file yang dipilih
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData(); // Membuat FormData untuk mengirim file
    formData.append("image", file);

    // Panggil API back-end menggunakan fetch
    fetch("https://emisi-scanner.vercel.app/predict", {
      // Pastikan URL ini sesuai dengan backend Anda
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json", // Ini untuk memberi tahu server bahwa Anda menerima JSON
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse hasil JSON
      })
      .then((data) => {
        console.log("Prediction Result:", data);
        // Menampilkan hasil prediksi ke pengguna
        alert("Prediction: " + JSON.stringify(data));
      })
      .catch((error) => {
        console.error("There was an error with the prediction:", error);
        alert("Error while processing the image. Please try again.");
      });
  });