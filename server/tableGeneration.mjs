
import db from "./db.mjs";

// List of 50 sentences
const sent = [
  "the cat chased the mouse",
  "i lost my favorite book",
  "he drives a red car",
  "she baked a chocolate cake",
  "the children played in the park",
  "i found a shiny coin",
  "we watched the sunset together",
  "the dog jumped over the fence",
  "he forgot his school bag",
  "she planted flowers in the garden",
  "the bird sang a happy song",
  "i built a sandcastle at the beach",
  "they are running down the street",
  "he painted a beautiful picture",
  "we cooked dinner last night",
  "the baby smiled at the stranger",
  "i bought a new pair of shoes",
  "she wore a red dress today",
  "the man opened the big door",
  "we walked along the riverbank",
  "the teacher wrote on the blackboard",
  "i saw a rainbow in the sky",
  "the dog fetched the tennis ball",
  "he drank a glass of water",
  "she tied her hair with a ribbon",
  "the boy rode his bicycle fast",
  "i cleaned my messy room yesterday",
  "the cat slept on the warm couch",
  "we sang songs around the campfire",
  "he carried the heavy box upstairs",
  "the kids built a treehouse together",
  "she drew a picture with crayons",
  "i listened to my favorite song",
  "the sun disappeared behind the clouds",
  "we planted trees in the backyard",
  "the baby crawled across the floor",
  "he climbed up the tall ladder",
  "she painted her nails bright pink",
  "the birds flew above the mountains",
  "i found my lost keys in the bag",
  "the dog wagged its tail happily",
  "we enjoyed a picnic in the park",
  "he fixed the broken chair quickly",
  "she read a book before bedtime",
  "i watched the stars at night",
  "the man carried groceries to the car",
  "the children laughed at the funny clown",
  "i cooked pancakes for breakfast",
  "the cat played with the yarn ball",
  "we walked home under the warm sun"
];

async function main() {
 
 // Delete all existing rows
/*   await db.run('DELETE FROM sentences');
  
  // Reset AUTOINCREMENT counter
  await db.run("DELETE FROM sqlite_sequence WHERE name='sentences'");
 */
  // Insert sentences with length (ignoring spaces)
  for (const text of sent) {
    const length = text.replace(/\s+/g, "").length;
    await db.run('INSERT INTO sentences (text, length) VALUES (?, ?)', text, length);
  }

  console.log('All sentences inserted successfully and table reset!');
   await db.close();
}

main();
