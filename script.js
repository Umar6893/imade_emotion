
        // Elements from the DOM
        const imageUpload = document.getElementById('imageUpload');
        const imagePreview = document.getElementById('imagePreview');
        const detectEmotionBtn = document.getElementById('detectEmotionBtn');
        const emotionResult = document.getElementById('emotionResult');

        // API Details for Face++ (Replace with your actual API key and secret)
        const apiKey = "xwsknqRASZ9aAlXmM36q5Zqa874ceALw"; // Replace with your Face++ API key
        const apiSecret = "dHb5d5T2e4GXnCioWRFmw_H_39v7PD-r"; // Replace with your Face++ API secret
        const apiUrl = "https://api-us.faceplusplus.com/facepp/v3/detect"; // Face++ API endpoint

        // Function to display the image preview
        imageUpload.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();

                // When the image is successfully loaded
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = "block"; // Show the image
                }

                reader.readAsDataURL(file);
            } else {
                imagePreview.style.display = "none"; // Hide if no image is uploaded
            }
        });

        // Function to call the Face++ API
        const detectEmotion = async (imageFile) => {
            const formData = new FormData();
            formData.append('api_key', apiKey);
            formData.append('api_secret', apiSecret);
            formData.append('image_file', imageFile);
            formData.append('return_attributes', 'emotion');

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error("Error in fetching the API");

                const data = await response.json();
                displayEmotion(data);
            } catch (error) {
                console.error('Error:', error);
                emotionResult.innerHTML = `<p>Error detecting emotion. Please try again.</p>`;
            }
        };

        // Function to display emotion results
        const displayEmotion = (data) => {
            if (data && data.faces && data.faces[0]) {
                let emotions = data.faces[0].attributes.emotion;
                let emotionHTML = '<h3>Detected Emotions:</h3>';
                
                for (let [emotion, confidence] of Object.entries(emotions)) {
                    emotionHTML += `<p>${emotion}: ${confidence}% confidence</p>`;
                }

                emotionResult.innerHTML = emotionHTML;
            } else {
                emotionResult.innerHTML = `<p>No emotions detected.</p>`;
            }
        };

        // Event Listener for the button click
        detectEmotionBtn.addEventListener('click', () => {
            const imageFile = imageUpload.files[0];
            if (imageFile) {
                detectEmotion(imageFile);
            } else {
                emotionResult.innerHTML = `<p>Please upload an image first.</p>`;
            }
        });

