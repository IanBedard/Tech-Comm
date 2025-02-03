$(document).ready(function() {
    var jsonData = {}; 

    $.getJSON("tech-comm.json")
        .done(function(data) {
            jsonData = data;
            var $categorySelect = $("#category");

            // Populate the category dropdown
            $.each(jsonData, function(key, value) {
                $categorySelect.append(`<option value="${key}">${value.title} (${value.datePublished})</option>`);
            });

            $categorySelect.select2({
                placeholder: "Select a category",
                allowClear: true
            });

            var availableDates = Object.keys(jsonData).map(key => key.split('-').slice(0, 3).join('-'));

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
                    var resultHtml = '';

                    $.each(jsonData, function(key, value) {
                        if (key.startsWith(dateText)) {
                            resultHtml += generateResultHtml(value);
                        }
                    });

                    if (resultHtml === '') {
                        resultHtml = "<h2 class='text-danger text-center'>No Data Available for the selected date.</h2>";
                    }

                    $("#result").html(resultHtml);
                }
            });

            $("#calendarIcon").on("click", function() {
                $("#datePicker").datepicker("show");
            });

            function loadEntryFromURL() {
                var entryID = new URLSearchParams(window.location.search).get('entry');
                
                if (entryID && jsonData[entryID]) {
                    var value = jsonData[entryID];
                    var resultHtml = generateResultHtml(value);
                    $("#result").html(resultHtml);
                } else {
                    $("#result").html("<h2 class='text-danger text-center'>No Data Available for the selected entry.</h2>");
                }
            }

            loadEntryFromURL();
            
        })
        .fail(function() {
            $("#result").html("<h2 class='text-danger text-center'>Failed to load the data file.</h2>");
        });

    $("#fetchData").click(function() {
        var selectedCategory = $("#category").val();
        $("#result").html("<h2 class='text-center text-primary'>Loading...</h2>");

        setTimeout(() => {
            if (jsonData[selectedCategory]) {
                var data = jsonData[selectedCategory];
                var resultHtml = generateResultHtml(data);
                $("#result").html(resultHtml);
            } else {
                $("#result").html("<h2 class='text-danger text-center'>No Data Available for the selected category.</h2>");
            }
        }, 500);
    });

    function formatDate(dateString) {
        var date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function generateResultHtml(value) {
        let resultHtml = `
            <h2 property="name" id="wb-cont">${value.title}</h2>
            <h3 class="mrgn-tp-0">${value.category} - ${formatDate(value.datePublished)}</h3>
            <div class="clearfix"></div>
            <table class="table table-bordered table-striped">
                <tbody>
        `;
    
        if (value.audience) {
            resultHtml += `<tr><th>Audience</th><td>${Array.isArray(value.audience) ? value.audience.join('<br>') : value.audience}</td></tr>`;
        }
        if (value.whatYouNeedToKnow) {
            const whatYouNeedToKnowContent = value.whatYouNeedToKnow.map(item => 
                typeof item === 'string' 
                    ? `<p>${item}</p>` 
                    : item.details 
                        ? `<ul>${item.details.map(detail => `<li>${detail}</li>`).join('')}</ul>` 
                        : ''
            ).join('');
            resultHtml += `<tr><th>What You Need to Know</th><td>${whatYouNeedToKnowContent}</td></tr>`;
        }
        if (value.actionRequired) {
            const actionRequiredContent = value.actionRequired.map(item => 
                typeof item === 'string' 
                    ? `<p>${item}</p>` 
                    : item.details 
                        ? `<ul>${item.details.map(detail => `<li>${detail}</li>`).join('')}</ul>` 
                        : ''
            ).join('');
            resultHtml += `<tr><th>Action Required</th><td>${actionRequiredContent}</td></tr>`;
        }
        if (value.notes) {
            const notesContent = value.notes.map(item => 
                typeof item === 'string' 
                    ? `<p>${item}</p>` 
                    : item.details 
                        ? `<ul>${item.details.map(detail => `<li>${detail}</li>`).join('')}</ul>` 
                        : ''
            ).join('');
            resultHtml += `<tr><th>Notes</th><td>${notesContent}</td></tr>`;
        }
        if (value.resources) {
            const resourcesContent = value.resources.map(item => 
                item.href 
                    ? `<a href="${item.href}">${item.title || item.href}</a>` 
                    : item.details 
                        ? item.details.map(detail => `<a href="${detail.href}">${detail.title || detail.href}</a>`).join('<br>') 
                        : ''
            ).join('<br>');
            resultHtml += `<tr><th>Resources</th><td>${resourcesContent}</td></tr>`;
        }
        if (value.whoToContact) {
            const whoToContactContent = value.whoToContact.map(item => 
                item.href 
                    ? `<a href="${item.href}">${item.title || item.href}</a>` 
                    : item.details 
                        ? item.details.map(detail => `<a href="${detail.href}">${detail.title || detail.href}</a>`).join('<br>') 
                        : ''
            ).join('<br>');
            resultHtml += `<tr><th>Who to Contact</th><td>${whoToContactContent}</td></tr>`;
        }
        if (value.shareableLink && value.shareableLink.href) {
            resultHtml += `<tr><th>Shareable Link</th><td><a href="${value.shareableLink.href}">${value.shareableLink.title || value.shareableLink.href}</a></td></tr>`;
        }
    
        resultHtml += `
                </tbody>
            </table>
        `;
    
        return resultHtml;
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return isNaN(date) ? "Invalid Date" : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
});
