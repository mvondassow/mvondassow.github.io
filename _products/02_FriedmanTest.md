---
layout: page
title:  "Non-parametric ANOVA"
---
<img src="" alt="Table" style="float:right;width:300px;padding:10px">
<!-- Wording here needs to be looked at carefully -->

The Friedman test is a statistical test of the null hypothesis that there are no differences among groups for a set of groups. It is a non-parametric test, meaning that it does not depend on the specific shape of the distribution of the data. If the shape and spread of the data are the same for each group, it can be used to test whether the means (or medians) are the same among the groups. However, if the shape or spread of the data do differ among the groups, it can be used to test a somewhat less specific (but equally meaningful) null hypothesis: that the probability of having a higher (lower) rank is similar among the groups.

The functions in [this Python package](https://github.com/mvondassow/FriedTests/tree/921f42b526bd38e38e55ba7e5244edb380fef5c9) can be used to do the Friedman test, and -- if appropriate -- multiple comparisons among pairs of groups following the Friedman test. The user can choose whether to use either of two approximate distributions, or use randomization to get an empirical distribution. The latter is better for small sample sizes.

In the "FriedValidation" module, tests are compared to examples in Conover and simulated values.
