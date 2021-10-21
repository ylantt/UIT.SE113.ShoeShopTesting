const submitBtn = document.querySelector('.submit');
const closeFeedback = document.querySelector('.close-btn .fas');
const feedbackBox = document.querySelector('.feedback-user');
const username = document.getElementById('name');
const feedback = document.getElementById('feedback');
const starDiv = feedbackBox.querySelector('.stars');
const writeBtn = document.querySelector('.btn-write');
const reviewContent = document.querySelector('.review-content');

//rating defaut 5 star
let userRatingStar = 5;
const numberStar = 5;
// initialize rating object
let ratingStars = {
    numRating: 0, //so luot rating
    avgRating : 0,// tong diem rating
};

// // initialize number of stars 
Array.from({ length: numberStar }, (_, i) => {
    let number = ++i;
    ratingStars[`${number}stars`] = 0;   
});

setDefautRating();
// calcRating();
// show, hide feedback form


writeBtn.addEventListener('click', () => {
    feedbackBox.classList.add('show');
});
closeFeedback.addEventListener('click', setDefautRating);
//submit feedback
submitBtn.addEventListener('click', function(){
    var slug = this.getAttribute("slug");
    if(username.value !== '' && feedback.value !== ''){
        const options = {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        };
        let time = new Date().toLocaleDateString('en-US', options);
       

        $.ajax({
            url: "/client/api/feedback",
            type: "post",
            data: { username: username.value, feedback: feedback.value, slug: slug, starNumber: userRatingStar, time: time},
            success: function (response) {
                const result = feedbacks.filter(feedback => feedback.starNumber == parseInt(userRatingStar)); 
                const percent = Math.round(result.length /feedbacks.length *100 );
                $("#percent-" + userRatingStar).text(result + "%");
                alert(percent);
                location.reload();            
            },
            error: function (err) {
            alert(err);
        },
        });

       
        
        //When success
        // ratingStars[`${userRatingStar}stars`]++;
        // ratingStars.numRating++;
        calcRating();
        
        //submit success
        setDefautRating();

    }
})
    
function setDefautRating() {
    feedbackBox.classList.remove('show');
    username.value = '',
    feedback.value = '',
    userRatingStar = 5;
    starDiv.innerHTML = '';

    Array.from({ length: numberStar }, (_, i) => {
        let number = ++i;
        //create element star
        const starEle = document.createElement('i');
        starEle.classList.add('fas', 'fa-star', 'fa-fw');
        starEle.dataset.rating = number;

        starEle.addEventListener('click', () => {
            handleRating(number);
        });
        starDiv.appendChild(starEle);
    });
}
function handleRating(number){
    const stars = feedbackBox.querySelectorAll('.stars i');
    userRatingStar = number;
    console.log(userRatingStar);
    stars.forEach(star=> {
        if(number<star.dataset.rating){
            star.classList.remove('fas');
            star.classList.add('far');
        }
        else{
            star.classList.add('fas');
            star.classList.remove('far');
        }
    });
}
// function setStars(number) {
//     let stars = '';
//     Array.from({length: numberStar},(_, i) =>{
//         let starNth = 0;
//         starNth = ++i;
//         stars += `${
//             number >= starNth
//             ? "<i class='fas fa-fw fa-star'></i>"
//             : number >= starNth - 0.5
//             ? "<i class='fas fa-fw fa-star-half'></i>"
//             : "<i class='far fa-fw fa-star'></i>"
//         }`;
//     });
//     return stars;
// }
// function calcRating(){
//     let sumStars = 0;
//     let indexProgress = 0;
//     const barItems = document.querySelectorAll('.rating-bar .bar-item');
//     for(let number = numberStar; number >= 1; number-- ){
//         let percent = 0;

//         const numberOfStars = ratingStars[`${number}stars`];
//         if(numberOfStars){
//             sumStars += number * numberOfStars;
//             percent = ((numberOfStars / ratingStars.numRating) * 100).toFixed(1);
//         }
//         barItems[indexProgress].querySelector(
//             '.progress-line'
//         ).style.width = `${percent}%`;
//         barItems[indexProgress].querySelector(
//             '.percent'
//         ).textContent = `${percent}%`;
//         indexProgress++;
//     }
//     if(ratingStars.numRating){
//         ratingStars.avgRating = (sumStars / ratingStars.numRating).toFixed(1);
//     }
//     document.querySelector('.count-review span').textContent = ratingStars.numRating;
//     document.querySelector('.rating-count .count').textContent = ratingStars.numRating;
//     document.querySelector('.start-count .avg').textContent = ratingStars.avgRating ;
//     document.querySelector('.avg-stars').innerHTML = setStars(ratingStars.avgRating);

// }