Sprawozdanie

1) Sekrety i zmienne
   - sekret GH_TOKEN - token z uprawnieniami workflow, a także z write, read i delete (czemu?, bo zawsze jakieś ryzyko) :packages dla GITHUB
   - sekret DOCKERHUB_TOKEN – token z uprawnieniem Read & Write dla DOCKERHUB
   - zmienna DOCKERHUB_USERNAME – jest to nazwa użytkownika DOCKERHUB

2) konfiguracja
   - Zdefiniowałem wyzwalanie workflow na gałęzi main.
   - Skonfigurowałem reakcję na utworzenie (lub zaktualizowanie) repozytorium za pomocą tagu zaczynającego się na v, a także umożliwiłem ręczne wywołanie (workflow_dispatch).
   - Przydzieliłem następujące uprawnienia dla akcji:
     
      - contents: read
      - packages: write
      - id-token: write
   
   - W pierwszym kroku workflow pobierane jest repozytorium (actions/checkout), aby runner miał dostęp do wszystkich plików
   - Następnie generowane są tagi obrazu (z docker/metadata-action).
   - Później konfigurowane są środowiska QEMU oraz Buildx, a także logowanie do Docker Huba i GitHub Container Registry.
  
4) Testowanie
   - Przed zbudowaniem obrazu wieloarchitekturowego tworzę osobne obrazy dla każdej platformy (linux/amd64 i linux/arm64) i testuję je za pomocą Trivy.
   - Jeśli Trivy wykryje podatności o priorytecie CRITICAL lub HIGH, workflow zostaje przerwany.
   - Podczas tych etapów obrazy pobierają cache z repozytorium na Docker Hubie oraz zapisują nową wersję cache w lokalnym katalogu projektu.
   - Zebrany cache będzie wykorzystany przy właściwym, pełnym buildzie obrazu wieloarchitekturowego.

5) Publikowanie obrazu
   - W kolejnym kroku wykonywana jest akcja budująca ponownie obraz. Wykorzystuje do tego lokalny cache, lecz tym razem eksportuje go do publicznego repozytorium na Docker Hub.
   - Gotowy wieloarchitekturowy obraz zostaje wypchnięty do ghcr.io z odpowiednim tagiem

6) Bonus - Przyjęty sposób tagowania:
   - Automatyczne tagowanie obrazów w GitHub Actions odbywa się na trzy sposoby:
     - Każdy nowy obraz jest tagowany jako latest (flavor: latest=true), co pozwala na szybki dostęp do najnowszej wersji.
     - Jeśli w repozytorium znajduje się tag zaczynający się od v, obraz zostaje oznaczony numerem wersji (pattern={{version}}).
     - W przypadku braku tagu wersji, obraz otrzymuje tag w postaci skrótu SHA1 commita, z którego został zbudowany.
   - Głównym tagiem po latest jest tag SHA, posiada wyższy priorytet nad tagiem version
   - Dodanie tagu latest ułatwia nawigacje po wersjach obrazu
   - Dodatkow informacje do wykorzystanej metody: https://github.com/docker/metadata-action
