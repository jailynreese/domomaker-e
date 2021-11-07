const intro = (props) => {
    return (
        <h2>Hi, my name is {props.name}. I am {props.age} and I love to eat {props.snack}!</h2>
    );
};

$(document).ready(function(){
    sendAjax('GET', '/getDomo', null, (result) => {
        intro(result);
    });
});