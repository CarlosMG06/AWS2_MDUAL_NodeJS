# Guia ESLint Stylistic · 9 · Pràctica

### 1.

Contingut `abans.txt`:
```
Disponibles: 2
Valor total: 760 €
```

### 2.

Resultat `npx eslint desordenat.js`:
```
  1:9    error  Operator '=' must be spaced                          @stylistic/space-infix-ops
  1:18   error  Strings must use doublequote                         @stylistic/quotes
  1:28   error  Missing semicolon                                    @stylistic/semi
  2:19   error  A space is required after '{'                        @stylistic/object-curly-spacing
  2:24   error  Missing space before value for key 'nom'             @stylistic/key-spacing
  2:24   error  Strings must use doublequote                         @stylistic/quotes
  2:31   error  A space is required after ','                        @stylistic/comma-spacing
  2:38   error  Missing space before value for key 'valor'           @stylistic/key-spacing
  2:41   error  A space is required after ','                        @stylistic/comma-spacing
  2:48   error  Missing space before value for key 'estat'           @stylistic/key-spacing
  2:48   error  Strings must use doublequote                         @stylistic/quotes
  2:60   error  A space is required before '}'                       @stylistic/object-curly-spacing
  2:61   error  A space is required after ','                        @stylistic/comma-spacing
  2:62   error  A space is required after '{'                        @stylistic/object-curly-spacing
  2:67   error  Missing space before value for key 'nom'             @stylistic/key-spacing
  2:67   error  Strings must use doublequote                         @stylistic/quotes
  2:73   error  A space is required after ','                        @stylistic/comma-spacing
  2:80   error  Missing space before value for key 'valor'           @stylistic/key-spacing
  2:81   error  A space is required after ','                        @stylistic/comma-spacing
  2:88   error  Missing space before value for key 'estat'           @stylistic/key-spacing
  2:88   error  Strings must use doublequote                         @stylistic/quotes
  2:100  error  A space is required before '}'                       @stylistic/object-curly-spacing
  3:1    error  A space is required after '{'                        @stylistic/object-curly-spacing
  3:1    error  Expected indentation of 2 spaces but found 0         @stylistic/indent
  3:6    error  Missing space before value for key 'nom'             @stylistic/key-spacing
  3:6    error  Strings must use doublequote                         @stylistic/quotes
  3:12   error  A space is required after ','                        @stylistic/comma-spacing
  3:19   error  Missing space before value for key 'valor'           @stylistic/key-spacing
  3:22   error  A space is required after ','                        @stylistic/comma-spacing
  3:29   error  Missing space before value for key 'estat'           @stylistic/key-spacing
  3:29   error  Strings must use doublequote                         @stylistic/quotes
  3:38   error  A space is required before '}'                       @stylistic/object-curly-spacing
  3:40   error  Missing semicolon                                    @stylistic/semi
  4:28   error  Requires a space after '{'                           @stylistic/block-spacing
  4:28   error  Missing space before opening brace                   @stylistic/space-before-blocks
  4:29   error  This line has 2 statements. Maximum allowed is 1     @stylistic/max-statements-per-line
  4:55   error  A space is required after ','                        @stylistic/comma-spacing
  4:57   error  Missing space before =>                              @stylistic/arrow-spacing
  4:60   error  Missing space after =>                               @stylistic/arrow-spacing
  4:64   error  Operator '+' must be spaced                          @stylistic/space-infix-ops
  4:72   error  A space is required after ','                        @stylistic/comma-spacing
  4:75   error  Requires a space before '}'                          @stylistic/block-spacing
  4:75   error  Missing semicolon                                    @stylistic/semi
  5:1    error  Expected indentation of 0 spaces but found 2         @stylistic/indent
  5:39   error  Expected parentheses around arrow function argument  @stylistic/arrow-parens
  5:51   error  Operator '===' must be spaced                        @stylistic/space-infix-ops
  5:54   error  Strings must use doublequote                         @stylistic/quotes
  5:67   error  Missing semicolon                                    @stylistic/semi
  6:1    error  Expected space(s) after "if"                         @stylistic/keyword-spacing
  6:22   error  Operator '>' must be spaced                          @stylistic/space-infix-ops
  6:25   error  Missing space before opening brace                   @stylistic/space-before-blocks
  6:27   error  This line has 2 statements. Maximum allowed is 1     @stylistic/max-statements-per-line
  6:76   error  Missing semicolon                                    @stylistic/semi
  7:1    error  Expected indentation of 0 spaces but found 6         @stylistic/indent
  7:34   error  Operator '+' must be spaced                          @stylistic/space-infix-ops
  7:55   error  Operator '+' must be spaced                          @stylistic/space-infix-ops
  7:56   error  Strings must use doublequote                         @stylistic/quotes
  7:61   error  Missing semicolon                                    @stylistic/semi
  8:15   error  Operator '=' must be spaced                          @stylistic/space-infix-ops
  8:16   error  A space is required after '{'                        @stylistic/object-curly-spacing
  8:27   error  A space is required after ','                        @stylistic/comma-spacing
  8:30   error  A space is required before '}'                       @stylistic/object-curly-spacing
  8:31   error  Missing semicolon                                    @stylistic/semi

✖ 63 problems (63 errors, 0 warnings)
  61 errors and 0 warnings potentially fixable with the `--fix` option.
```

Surten 63 problemes, 61 dels quals diu que es poden corregir sols.

### 3.

Resultat `npx eslint desordenat.js --fix`:
```
  4:31  error  This line has 2 statements. Maximum allowed is 1  @stylistic/max-statements-per-line
  6:31  error  This line has 2 statements. Maximum allowed is 1  @stylistic/max-statements-per-line

✖ 2 problems (2 errors, 0 warnings)
```

Ha corregit gairebé tot:
- cometes (`quotes`)
- punt i coma (`semi`)
- indentació (`indent`)
- parèntesis a funcions fletxa (`arrow-parens`)
- espaiament (`space-infix-ops`, `object-curly-spacing`, `key-spacing`, `comma-spacing`, `block-spacing`, `space-before-blocks`, `arrow-spacing` i `keyword-spacing`)

No ha corregit les línies amb múltiples sentències per línia (`max-statements-per-line`).

### 5.

Contingut `despres.txt`:
```
Disponibles: 2
Valor total: 760 €
```

Resultat comparació amb `git diff`:
```
$ git diff --no-index abans.txt despres.txt
$ 
```

No hi ha cap diferència.
