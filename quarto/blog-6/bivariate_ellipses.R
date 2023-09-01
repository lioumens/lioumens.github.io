
# setup -------------------------------------------------------------------

library(tibble)
library(mvtnorm)
library(ellipse)
library(tidyverse)
library(ggfx)

source("theme_blog.R")

# parameters --------------------------------------------------------------

rho <- .7
sig1 <- 1.5
sig2 <- .8

# main --------------------------------------------------------------------

mat <- matrix(c(sig1^2, rho * sig1 * sig2,
                rho*sig1*sig2, sig2^2), nrow = 2)


dat <- rmvnorm(5000,mean = c(0, 0), sigma = mat)

g2 <- dat |> 
  as_tibble(.name_repair = ~c("x", "y")) |> 
  ggplot(aes(x = x, y = y)) +
  geom_point(pch = 16,
             size = .4,
             alpha = .4
             ) +
  geom_path(mapping = aes(x, y ),
            data = as.data.frame(ellipse(mat)),
            alpha = 1) +
  geom_path(mapping = aes(x, y ),
            data = as.data.frame(ellipse(mat, level = .6)),
            alpha = 1) +
  geom_path(mapping = aes(x, y ),
            data = as.data.frame(ellipse(mat, level = .3)),
            alpha = 1) +
  geom_path(mapping = aes(x, y ),
            data = as.data.frame(ellipse(mat, level = .1)),
            alpha = 1) +
  scale_y_continuous(breaks = c(-5, -2.5, 0, 2.5, 5)) +
  scale_x_continuous(breaks = c(-4, 0, 4)) +
  theme_blog() +
  theme(axis.line = element_line(arrow = arrow(type = "open", length = unit(7, 'pt'))))

ggsave(plot = g2,
       filename = "bivariate_ellipses.svg",
       bg = "#3b4252",
       width = 4.2,
       height = 4)


