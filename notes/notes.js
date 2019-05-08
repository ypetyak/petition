res.render('petition')

// if error return this:

res.render('petition', {
    error: true
});


// for handlebars

{{#if error}}
<div class="error"> Opps! Error</div>
{{/if}}

/////


db.query('', [first || null, last || null, sig || null]) // if empty we make it to be null, so DB will throw an error


///

//we listen for mouse down on a canvas, and then do something


//canvas

canvas.getDataUrl // is what we want to put in our database


///

<form method="POST">
    <input name="first">
    <input name="last">
    <input name="sig" type="hidden">
</form>


// 4 routs

// get for petition

// post for petition
//
// get for thankyou page
//
// get for signups age


////////

    <!-- <link href="https://fonts.googleapis.com/css?family=Space+Mono" rel="stylesheet"> -->

        /* font-family: "Space Mono", monospace; */
