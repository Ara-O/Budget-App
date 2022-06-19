export function validateEntries(...allFields): boolean{
    let missingField: boolean;
    allFields.forEach((el) => {
      if (typeof(el) === "string" && el.replace(/\s/g, "") === "") {
        missingField = true;
      }
    });

    return missingField === true ? false : true;
  }
