$(document).ready(function(){
    //자신의 레포지토리 아이디를 username변수에 저장!
    const username = 'zoilee';

    $.getJSON(`https://api.github.com/users/${username}/repos`, function(data){
        
        //레포지토리 최신 순 정렬
        data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        const resposToShow = data.slice(0, 5); // 상위 5개 표시
        $.each(resposToShow, function(index, repo){
            const repoHtml = `
                        <li class="my-4">
                            <h1>${repo.name}</h1>
                            <p>${repo.description}</p>
                            <a href="${repo.html_url}" target="_blank">링크</a>
                        </li>
                    `;
            $("#repo").append(repoHtml);
        });
    
    }).fail(function(){
        console.error('에러발생');
    });


});