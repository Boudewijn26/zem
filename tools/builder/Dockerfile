FROM gradle:6.8.3-jdk15

ENV PATH=/root/.yarn/bin:$PATH
RUN apt-get update -qq && \
  apt-get install -qq -y --no-install-recommends curl && \
  curl -sL https://deb.nodesource.com/setup_14.x | bash && \
  apt-get install -qq -y --no-install-recommends nodejs
