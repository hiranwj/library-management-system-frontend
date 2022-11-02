const pageSize = 5;
let page = 1;

getMembers();

function getMembers(query=`${$(`#txt-search`).val()}`) {
    /* (1) Initialize a XMLHttpRequest object */
    const http = new XMLHttpRequest();


    /* (2) set an event listener to detect state change */
    http.addEventListener('readystatechange', ()=> {
        if(http.readyState === http.DONE){
            if(http.status === 200){
                // console.log(http.responseText);

                const totalMembers = +http.getResponseHeader('X-Total-Count'); // + for convert to integer
                initPagination(totalMembers);

                const members = JSON.parse(http.responseText); // return members array
                $('#loader').hide();
                if (members.length === 0){
                    $('#tbl-members').addClass('empty');
                }else {
                    $('#tbl-members').removeClass('empty');
                }

                members.forEach(member => {
                    const rowHtml = `
                    <tr tabindex="0">
                        <td>${member.id}</td>
                        <td>${member.name}</td>
                        <td>${member.address}</td>
                        <td>${member.contact}</td>
                    </tr>
                `;
                $('#tbl-members tbody').append(rowHtml);
                });
                
            }else{
                $('#toast').show();
                // console.error('Something went wrong');
            }
        }
    });

    /* (3) Open the request */
    http.open('GET', `http://localhost:8080/lms/api/members?size=${pageSize}&page=${page}&q=${query}`, true);

    /* (4) Set additioanl information for the request (can get from documentation)*/


    /* (5) Send the request */
    http.send();
}


function initPagination(totalMembers){

    const totalPages = Math.ceil(totalMembers/pageSize);

    if (totalPages === 1){
        $("#pagination").addClass('d-none');
    }else{
        $("#pagination").removeClass('d-none');
    }

    let html = '';
    for(let i=1; i <= totalPages; i++){
        html += `<li class="page-item ${i===page?'active':''}"><a class="page-link" href="#">${i}</a></li>`
    }
    html = `
        <li class="page-item ${page === 1? 'disabled': ''}"><a class="page-link" href="#">Previous</a></li>
        ${html}
        <li class="page-item ${page === totalPages? 'disabled': ''}"><a class="page-link" href="#">Next</a></li>
        `;

    $('#pagination > .pagination').html(html);

    $('#pagination > .pagination').click((eventData)=> {
        // console.log(eventData.target);
        const elm = eventData.target;
        if (elm && elm.tagName === 'A') {
            // console.log($(elm).text());
            const activePage = ($(elm).text());
            if (activePage === 'Next') {
                page++;
                getMembers();
            }else if (activePage === 'Prevoius') {
                page--;
                getMembers();
            }else{
                if (page !== activePage){
                    page = +activePage;
                    getMembers();
                }
                
            }
        }
    });
}

$('#txt-search').on('input', ()=>{
    // console.log("working");
    page = 1;
    getMembers();
});

$(`#tbl-members tbody`).keyup((eventData)=> {
    if (eventData.which === 38){
        // console.log('Up arrow key pressed');
        const elm = document.activeElement.previousElementSibling;
        if (elm instanceof HTMLTableRowElement) {
            elm.focus();
        }
    }else if(eventData.which === 40){
        // console.log('Down arrow key pressed');
        const elm = document.activeElement.nextElementSibling;
        if (elm instanceof HTMLTableRowElement) {
            elm.focus();
        }
    }
});

$(document).keyup((eventData)=>{
    // console.log(eventData);
    if(eventData.ctrlKey && eventData.key === '/'){
        $('#txt-search').focus();
    }
})