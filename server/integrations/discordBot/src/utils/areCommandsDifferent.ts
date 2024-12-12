// Checks if two commands are different

interface CommandChoice {
  name: string;
  value: any;
}

interface Command {
  choices?: CommandChoice[];
  [key: string]: any;
}

const areCommandsDifferent = (existingCommand: Command, localCommand: Command): boolean => {
  const areChoicesDifferent = (existingChoices: CommandChoice[] = [], localChoices: CommandChoice[] = []): boolean => {
    for (const localChoice of localChoices) {
      const existingChoice = existingChoices.find(
        (choice) => choice.name === localChoice.name
      );

      if (!existingChoice) {
        return true;
      }

      if (localChoice.value !== existingChoice.value) {
        return true;
      }
    }
    return false;
  };

  // Add additional checks for other properties of the commands if needed
  // Example:
  // if (existingCommand.name !== localCommand.name) {
  //   return true;
  // }

  return areChoicesDifferent(existingCommand.choices, localCommand.choices);
};

export default areCommandsDifferent;