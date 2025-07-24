async function identifyPlant() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an image");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result.split(",")[1];

    const response = await fetch("https://api.plant.id/v2/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": "SIXxnCdhS1xYNjlJtXjwSDBTIE7KaPNIT8oa4kHkH0TwHO3crh", // replace with your key safely
      },
      body: JSON.stringify({
        images: [base64Image],
        modifiers: ["crops_fast"],
        plant_language: "en",
        plant_details: ["common_names", "url", "wiki_description"],
      }),
    });

    const data = await response.json();
    console.log(data);

    if (data?.suggestions?.length) {
      const plant = data.suggestions[0];
      const name = plant.plant_name || "Unknown";
      const commonNames =
        plant.plant_details.common_names?.join(", ") || "Not available";
      const description =
        plant.plant_details.wiki_description?.value || "No description found.";
      const wikiUrl = plant.plant_details.url || "#";

      document.getElementById("result").innerHTML = `
        <strong>Scientific Name:</strong> ${name}<br>
        <strong>Common Names:</strong> ${commonNames}<br>
        <strong>Description:</strong> ${description}<br>
        <a href="${wikiUrl}" target="_blank">🔗 Learn more</a>
      `;
    } else {
      document.getElementById("result").innerText = "No plant found.";
    }
  };

  reader.readAsDataURL(file);
}
