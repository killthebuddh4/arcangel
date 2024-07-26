export const navie = () => null;

// give the input image to the model
// tell the model it has a blank field and some tools
// ask the model to draw the image
// apply the generated draw inputs to the field
// ask the model to diff the new image with the old one
// return the diff to the model
// depending on the diff, ask the model to retry or augment the field
// stop after a certain number of iterations
// do this for every input in the dataset and see how many times the model
// can do it.
// oh, also, think of some way to output the intermediate images and results and stuff.
