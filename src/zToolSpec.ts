import { z } from "zod";

// AN EXAMPLE OF A TOOL SPECIFICATION
//
// "tools": [
//     {
//       "type": "function",
//       "function": {
//         "name": "get_current_weather",
//         "description": "Get the current weather in a given location",
//         "parameters": {
//           "type": "object",
//           "properties": {
//             "location": {
//               "type": "string",
//               "description": "The city and state, e.g. San Francisco, CA"
//             },
//             "unit": {
//               "type": "string",
//               "enum": ["celsius", "fahrenheit"]
//             }
//           },
//           "required": ["location"]
//         }
//       }
//     }

export const zToolSpec = z.object({
  type: z.literal("function"),
  function: z.object({
    name: z.string(),
    description: z.string(),
    parameters: z.object({}),
  }),
});
