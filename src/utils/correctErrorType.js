const ErrorType = {}

ErrorType.category = {
  Misspelled: 'Misspelled',
  Formatting: 'Formatting',
  Wordiness: 'Wordiness',
  AccidentallyConfused: 'AccidentallyConfused',
}

ErrorType.categoryHuman = {
  Misspelled: 'Misspelled Words',
  Formatting: 'Improper Formatting',
  Wordiness: 'Wordy Sentences',
  AccidentallyConfused: 'Confused Words', 
}

ErrorType.categoryHumanText = {
  Misspelled: '拼错的单词',
  Formatting: '格式不正确',
  Wordiness: '冗长的句子',
  AccidentallyConfused: '混淆不清的单词',
}

ErrorType.categoryShap = {
  Misspelled: 'polygon',
  Formatting: 'ellipse',
  Wordiness: 'line',
  AccidentallyConfused: 'rectangle',
}

ErrorType.categoryColor = {
  Misspelled: 'red',
  Formatting: 'yellow',
  Wordiness: 'green',
  AccidentallyConfused: 'blue',
}

export default ErrorType