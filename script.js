$(document).ready(function() {
    var jsonData = {}; 

    // Load JSON data
    $.getJSON("tech-comm.json")
        .done(function(data) {
            jsonData = data;
            var $categorySelect = $("#category");

            // Populate the category dropdown
            $.each(jsonData, function(key, value) {
                $categorySelect.append(`<option value="${key}">${value.title} (${value.datePublished})</option>`);
            });

            // Initialize Select2 on the category dropdown
            $categorySelect.select2({
                placeholder: "Select a category",
                allowClear: true
            });

            // Create a list of available dates
            var availableDates = [];
            $.each(jsonData, function(key, value) {
                if (value.datePublished && !availableDates.includes(value.datePublished)) {
                    availableDates.push(value.datePublished);
                }
            });

            // Initialize the DatePicker
            $("#datePicker").datepicker({
                dateFormat: 'yy-mm-dd',
                beforeShowDay: function(date) {
                    var dateString = $.datepicker.formatDate('yy-mm-dd', date);
                    return [availableDates.includes(dateString), ''];
                }
            });

            // Handle the selection of a date
            $("#datePicker").change(function() {
                var selectedDate = $(this).val();
                if (selectedDate) {
                    var resultHtml = '';

                    // Loop through all entries with the selected date
                    $.each(jsonData, function(key, value) {
                        if (value.datePublished === selectedDate) {
                            resultHtml += `
                                <div class="result-entry">
                                    <h2 class="text-primary">${value.title}</h2>
                                    <p><strong>Category:</strong> ${value.category}</p>
                                    <p><strong>Date Published:</strong> ${value.datePublished}</p>
                            `;

                            if (value.audience) {
                                resultHtml += `<p><strong>Audience:</strong> ${value.audience}</p>`;
                            }
                            if (value.whatYouNeedToKnow) {
                                resultHtml += `<p><strong>What You Need to Know:</strong> ${value.whatYouNeedToKnow}</p>`;
                            }
                            if (value.actionRequired) {
                                resultHtml += `<p><strong>Action Required:</strong> ${value.actionRequired}</p>`;
                            }
                            if (value.notes) {
                                resultHtml += `<p><strong>Notes:</strong> ${value.notes}</p>`;
                            }
                            if (value.resources) {
                                resultHtml += `<p><strong>Resources:</strong> <a href="${value.resources}">${value.resources}</a></p>`;
                            }
                            if (value.whoToContact) {
                                resultHtml += `<p><strong>Who to Contact:</strong> <a href="${value.whoToContact}">${value.whoToContact}</a></p>`;
                            }
                            if (value.shareableLink) {
                                resultHtml += `<p><strong>Shareable Link:</strong> <a href="${value.shareableLink}">Share this link</a></p>`;
                            }
                            resultHtml += `</div><hr>`;
                        }
                    });

                    if (resultHtml === '') {
                        resultHtml = "<h2 class='text-danger text-center'>No Data Available for the selected date.</h2>";
                    }

                    $("#result").html(resultHtml);
                }
            });

            // Function to load specific entry from the URL
            function loadEntryFromURL() {
                var entryID = new URLSearchParams(window.location.search).get('entry');
                
                if (entryID) {
                    if (jsonData[entryID]) {
                        var value = jsonData[entryID];
                        var resultHtml = `
                            <div class="result-entry">
                                <h2 class="text-primary">${value.title}</h2>
                                <p><strong>Category:</strong> ${value.category}</p>
                                <p><strong>Date Published:</strong> ${value.datePublished}</p>
                        `;

                        if (value.audience) {
                            resultHtml += `<p><strong>Audience:</strong> ${value.audience}</p>`;
                        }
                        if (value.whatYouNeedToKnow) {
                            resultHtml += `<p><strong>What You Need to Know:</strong> ${value.whatYouNeedToKnow}</p>`;
                        }
                        if (value.actionRequired) {
                            resultHtml += `<p><strong>Action Required:</strong> ${value.actionRequired}</p>`;
                        }
                        if (value.notes) {
                            resultHtml += `<p><strong>Notes:</strong> ${value.notes}</p>`;
                        }
                        if (value.resources) {
                            resultHtml += `<p><strong>Resources:</strong> <a href="${value.resources}">${value.resources}</a></p>`;
                        }
                        if (value.whoToContact) {
                            resultHtml += `<p><strong>Who to Contact:</strong> <a href="${value.whoToContact}">${value.whoToContact}</a></p>`;
                        }
                        if (value.shareableLink) {
                            resultHtml += `<p><strong>Shareable Link:</strong> <a href="${value.shareableLink}">Share this link</a></p>`;
                        }
                        resultHtml += `</div>`;

                        $("#result").html(resultHtml);
                    } else {
                        $("#result").html("<h2 class='text-danger text-center'>No Data Available for the selected entry.</h2>");
                    }
                } else {
                    $("#result").html("<h2 class='text-danger text-center'>No valid entry ID provided.</h2>");
                }
            }

            loadEntryFromURL();
            
        })
        .fail(function() {
            $("#result").html("<h2 class='text-danger text-center'>Failed to load the data file.</h2>");
        });

    // Fetch data when category dropdown is changed
    $("#fetchData").click(function() {
        var selectedCategory = $("#category").val();
        $("#result").html("<h2 class='text-center text-primary'>Loading...</h2>");

        setTimeout(() => {
            if (jsonData[selectedCategory]) {
                var data = jsonData[selectedCategory];
                var resultHtml = `
                    <h2 class="text-primary">${data.title}</h2>
                    <p><strong>Category:</strong> ${data.category}</p>
                    <p><strong>Date Published:</strong> ${data.datePublished}</p>
                `;

                if (data.audience) {
                    resultHtml += `<p><strong>Audience:</strong> ${data.audience}</p>`;
                }
                if (data.whatYouNeedToKnow) {
                    resultHtml += `<p><strong>What You Need to Know:</strong> ${data.whatYouNeedToKnow}</p>`;
                }
                if (data.actionRequired) {
                    resultHtml += `<p><strong>Action Required:</strong> ${data.actionRequired}</p>`;
                }
                if (data.notes) {
                    resultHtml += `<p><strong>Notes:</strong> ${data.notes}</p>`;
                }
                if (data.resources) {
                    resultHtml += `<p><strong>Resources:</strong> <a href="${data.resources}">${data.resources}</a></p>`;
                }
                if (data.whoToContact) {
                    resultHtml += `<p><strong>Who to Contact:</strong> <a href="${data.whoToContact}">${data.whoToContact}</a></p>`;
                }
                if (data.shareableLink) {
                    resultHtml += `<p><strong>Shareable Link:</strong> <a href="${data.shareableLink}">Share this link</a></p>`;
                }

                $("#result").html(resultHtml);
            } else {
                $("#result").html("<h2 class='text-danger text-center'>No Data Available for the selected category.</h2>");
            }
        }, 500);
    });
});