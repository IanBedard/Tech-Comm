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

            // Initialize the DatePicker with year selection
            $("#datePicker").datepicker({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                yearRange: "2000:2030",
                beforeShowDay: function(date) {
                    var dateString = $.datepicker.formatDate('yy-mm-dd', date);
                    return [availableDates.includes(dateString), ''];
                },
                onSelect: function(dateText) {
                    var selectedDate = dateText;
                    var resultHtml = '';
                
                    $.each(jsonData, function(key, value) {
                        if (value.datePublished === selectedDate) {
                            resultHtml += `
                                <h2 property="name" id="wb-cont">${value.title}</h2>
                                <h3 class="mrgn-tp-0">${value.category}</h3>
                                <h3>${value.datePublished}</h3>
                                <div class="clearfix"></div>
                                <table class="table table-bordered table-striped">
                                    <tbody>
                                        <tr><th>Audience</th><td>${value.audience || ''}</td></tr>
                                        <tr><th>What You Need to Know</th><td>${value.whatYouNeedToKnow || ''}</td></tr>
                                        <tr><th>Action Required</th><td>${value.actionRequired || ''}</td></tr>
                                        <tr><th>Notes</th><td>${value.notes || ''}</td></tr>
                                        <tr><th>Resources</th><td>${value.resources ? `<a href="${value.resources}">${value.resources}</a>` : ''}</td></tr>
                                        <tr><th>Who to Contact</th><td>${value.whoToContact ? `<a href="${value.whoToContact}">${value.whoToContact}</a>` : ''}</td></tr>
                                        <tr><th>Shareable Link</th><td>${value.shareableLink ? `<a href="${value.shareableLink}">Share this link</a>` : ''}</td></tr>
                                    </tbody>
                                </table>
                                <hr>
                            `;
                        }
                    });
                
                    if (resultHtml === '') {
                        resultHtml = "<h2 class='text-danger text-center'>No Data Available for the selected date.</h2>";
                    }
                
                    $("#result").html(resultHtml);
                }
            });

            // Open date picker when calendar icon is clicked
            $("#calendarIcon").on("click", function() {
                $("#datePicker").datepicker("show");
            });

            // Function to load specific entry from the URL
            function loadEntryFromURL() {
                var entryID = new URLSearchParams(window.location.search).get('entry');
                
                if (entryID) {
                    if (jsonData[entryID]) {
                        var value = jsonData[entryID];
                        var resultHtml = `
                            <h2 property="name" id="wb-cont">${value.title}</h2>
                            <h3 class="mrgn-tp-0">${value.category}</h3>
                            <h3>${value.datePublished}</h3>
                            <div class="clearfix"></div>
                            <table class="table table-bordered table-striped">
                                <tbody>
                                    <tr><th>Audience</th><td>${value.audience || ''}</td></tr>
                                    <tr><th>What You Need to Know</th><td>${value.whatYouNeedToKnow || ''}</td></tr>
                                    <tr><th>Action Required</th><td>${value.actionRequired || ''}</td></tr>
                                    <tr><th>Notes</th><td>${value.notes || ''}</td></tr>
                                    <tr><th>Resources</th><td>${value.resources ? `<a href="${value.resources}">${value.resources}</a>` : ''}</td></tr>
                                    <tr><th>Who to Contact</th><td>${value.whoToContact ? `<a href="${value.whoToContact}">${value.whoToContact}</a>` : ''}</td></tr>
                                    <tr><th>Shareable Link</th><td>${value.shareableLink ? `<a href="${value.shareableLink}">Share this link</a>` : ''}</td></tr>
                                </tbody>
                            </table>
                        `;
            
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
                    <h2 property="name" id="wb-cont">${data.title}</h2>
                    <h3 class="mrgn-tp-0">${data.category}</h3>
                    <h3>${data.datePublished}</h3>
                    <div class="clearfix"></div>
                    <table class="table table-bordered table-striped">
                        <tbody>
                            <tr><th>Audience</th><td>${data.audience || ''}</td></tr>
                            <tr><th>What You Need to Know</th><td>${data.whatYouNeedToKnow || ''}</td></tr>
                            <tr><th>Action Required</th><td>${data.actionRequired || ''}</td></tr>
                            <tr><th>Notes</th><td>${data.notes || ''}</td></tr>
                            <tr><th>Resources</th><td>${data.resources ? `<a href="${data.resources}">${data.resources}</a>` : ''}</td></tr>
                            <tr><th>Who to Contact</th><td>${data.whoToContact ? `<a href="${data.whoToContact}">${data.whoToContact}</a>` : ''}</td></tr>
                            <tr><th>Shareable Link</th><td>${data.shareableLink ? `<a href="${data.shareableLink}">Share this link</a>` : ''}</td></tr>
                        </tbody>
                    </table>
                `;
        
                $("#result").html(resultHtml);
            } else {
                $("#result").html("<h2 class='text-danger text-center'>No Data Available for the selected category.</h2>");
            }
        }, 500);
    });
});
