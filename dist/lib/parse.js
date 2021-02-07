import {handleError} from "../helpers/handlers.js";
import {ResourceStatus} from "./resource.js";
import {Value} from "./value.js";
export function parseJsonADResource(string, resource) {
  try {
    const jsonObject = JSON.parse(string);
    for (const key in jsonObject) {
      if (key == "@id") {
        const subject = jsonObject["@id"];
        if (typeof subject !== "string") {
          throw new Error("'@id' field must be a string");
        }
        resource.setSubject(subject);
        continue;
      }
      resource.set(key, new Value(jsonObject[key]));
    }
    resource.setStatus(ResourceStatus.ready);
  } catch (e) {
    resource.setError(e);
    handleError(e);
  }
  return;
}
