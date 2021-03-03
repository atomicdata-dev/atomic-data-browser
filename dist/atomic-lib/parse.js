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
        if (subject !== resource.getSubject()) {
          throw new Error(`Resource has wrong subject in @id. Received subject was ${subject}, expected ${resource.getSubject()}.`);
        }
        resource.setSubject(subject);
        continue;
      }
      try {
        const val = new Value(jsonObject[key]);
        resource.setUnsafe(key, val);
      } catch (e) {
        throw new Error(`Failed creating value for key ${key} in resource ${resource.getSubject()}. ${e.message}`);
      }
    }
    resource.setStatus(ResourceStatus.ready);
  } catch (e) {
    resource.setError(e);
    handleError(e);
  }
  return;
}
