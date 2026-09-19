# 커머셜 포토그래픽 택소노미

> 상업·시네마틱 실사 이미지의 촬영 어휘. 장르에서 스펙으로 내려가는 결정 순서로 프롬프트 조각을 조합합니다.

**9 Parts · 63 Categories · 387 Keywords**

Evidence status: 125 confirmed · 227 probable · 35 pending. Prefer confirmed entries, use probable entries with judgment, and do not treat pending entries as authoritative.

Prompt policy: 정량 스펙은 근거와 검색을 위해 보존한다. promptFragment는 수치만 반복하지 말고 화면에서 관찰되는 시각적 결과를 함께 설명한다. 수치 해석 능력은 생성 모델마다 다르므로 모델별 사용법은 스킬의 모델 프로필에서 관리한다.

## Part 1: 광학·카메라

렌즈 종류, 피사계 심도, 센서/포맷, 광학 아티팩트(플레어·보케·색수차·모션블러) (71개 키워드)

### 1. A. 초점거리·원근 · focal length / perspective

초점거리는 센서 포맷과 함께 화각과 확대율을 직접 바꾸고, 원근 과장과 압축은 동일 피사체 크기를 위한 카메라 시점 이동에서 파생된다.

| Keyword | Canonical ID | Relation | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ultra-wide 14mm |  |  | 초광각 14mm | 매우 짧은 초점거리로 극단적 넓은 화각 | FF 대각 114.2°(수평 104.3/수직 81.2) [C6] | 고정 시점에서는 매우 넓은 환경과 낮은 확대율. 동일 프레이밍을 위한 근접 촬영이 결합될 때 원근이 강하게 과장됨 | 14mm full-frame rectilinear ultra-wide lens | 확정 [C4][C6] | confirmed |
| wide-angle 24mm |  |  | 광각 24mm | 노멀보다 짧은 초점거리, 넓은 시야 | FF 대각 약 84°대 [C6] | 고정 시점에서는 넓은 환경과 낮은 확대율. 동일 프레이밍을 위한 접근이 결합될 때 원근이 과장됨 | 24mm full-frame rectilinear wide-angle lens | 유력 [C6] | probable |
| wide-normal 35mm |  |  | 준광각 35mm | 다큐·리포타주 표준 준광각 | FF 대각 63.4° [C6] | 고정 시점에서는 표준보다 넓은 화각. 동일 프레이밍을 위한 접근이 결합될 때 원근이 완만하게 과장됨 | 35mm full-frame rectilinear wide-normal lens | 확정 [C4][C6] | confirmed |
| normal 50mm |  |  | 표준 50mm | 인간 시야에 근접한 표준 렌즈 | FF 대각 46.8°(수평 39.6/수직 27.0) [C6] | 풀프레임 기준 중간 화각과 확대율. 동일 프레이밍 비교에서 카메라 거리의 기준 조건으로 사용 | 50mm full-frame rectilinear normal lens | 확정 [C6], Ray standard lens [C1] | confirmed |
| short-tele 85mm |  |  | 준망원 85mm | 풀프레임 기준 표준보다 좁은 화각과 높은 확대율을 갖는 인물용 준망원 | FF 대각 28.6° [C6] | 고정 시점에서는 좁은 화각과 높은 확대율. 동일 프레이밍을 위한 후퇴가 결합될 때 원근이 완만하게 압축됨 | 85mm full-frame rectilinear short-telephoto lens | 확정 [C4][C6] | confirmed |
| telephoto 135mm |  |  | 망원 135mm | 풀프레임 기준 좁은 화각과 높은 원거리 확대율을 갖는 망원 | FF 대각 18.2° [C6] | 고정 시점에서는 좁은 화각과 높은 확대율. 동일 프레이밍을 위한 후퇴가 결합될 때 원근이 뚜렷하게 압축됨 | 135mm full-frame rectilinear telephoto lens | 확정 [C4][C6] | confirmed |
| long-tele 200mm |  |  | 장망원 200mm | 강한 확대, 좁은 화각 | FF 대각 12.3°(수평 10.3/수직 6.9) [C6] | 고정 시점에서는 매우 좁은 화각과 강한 확대율. 동일 프레이밍을 위한 큰 후퇴가 결합될 때 원근이 강하게 압축됨 | 200mm full-frame rectilinear long-telephoto lens | 확정 [C4][C6] | confirmed |
| fisheye |  |  | 어안 | 직선을 곡선으로 결상하는 초광각 특수 렌즈 | 화각 rectilinear 표와 별도 계산 [C7] | 원형·강한 배럴 곡률, 중심 팽창 | fisheye lens, extreme curved distortion, bulging center | 유력 [C7], Ray fisheye 범주 [C1] | probable |
| perspective-compression | cp.perspective-compression | canonical | 원근 압축 | 같은 피사체 크기를 유지하려 카메라가 멀어질 때 전경과 배경의 크기 차가 줄어 층이 가까워 보이는 원근 현상 | 카메라와 피사체 사이 거리로 결정. 긴 초점거리는 같은 프레이밍을 위한 후퇴와 결합될 때 압축 효과를 만듦 [C4][C5] | 배경·전경이 실제보다 밀착, 시각적 평면화 | perspective compression under matched subject framing | 확정 [C4][C5] | confirmed |
| perspective-exaggeration | cp.perspective-exaggeration | canonical | 원근 과장 | 같은 피사체 크기를 유지하려 카메라가 가까워질 때 전경과 배경의 크기 차가 커져 깊이가 늘어나 보이는 원근 현상 | 카메라와 피사체 사이 거리로 결정. 짧은 초점거리는 같은 프레이밍을 위한 접근과 결합될 때 과장 효과를 만듦 [C4][C5] | 전경 돌출, 배경 후퇴, 공간 왜곡 | perspective exaggeration under matched subject framing | 확정 [C4][C5] | confirmed |
| retrofocus-wide |  |  | 레트로포커스 광각 | 후초점 설계로 짧은 초점거리에도 긴 후면 거리 확보 | 설계 유형 [C1] | 미러 클리어런스용 광각, 배럴 왜곡 경향 | retrofocus wide angle rendering | 유력 [C1] | probable |
| large-aperture-lens |  |  | 대구경 렌즈 | 큰 최대 조리개를 가진 고속 렌즈 계열 | Ray 독립 범주 [C1] | 얕은 심도·저조도 성능, 밝은 개방 | fast large-aperture lens, luminous wide-open | 유력 [C1] | probable |
| macro-lens |  |  | 매크로 | 1:1 이상 근접 확대 결상 렌즈 | (직접 근거 없음) | 극단 근접, 얕은 심도, 미세 디테일 | macro lens, extreme close-up, 1:1 magnification | pending(갭) | pending-gap |

### 2. B. 조리개·피사계 심도 · aperture / DoF

| Keyword | Canonical ID | Relation | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| shallow-dof |  |  | 얕은 심도 | 큰 조리개·긴 초점거리로 초점면 밖이 흐려짐 | CoC d=[f²/(N(S₁−f))]· \| S₂−S₁ \| /S₂ [C24] | 피사체 분리, 배경 녹아내림 | shallow depth of field, subject isolation, soft background | 확정 [C24][C10] | confirmed |
| deep-focus |  |  | 깊은 심도 | 짧은 초점거리·조인 조리개로 전역 선명 | 18mm가 105mm보다 깊음, f/16>f/4 [C10] | 전경부터 무한대까지 선명 | deep focus, everything sharp front to back | 확정 [C10], 유력 [C11] | confirmed |
| hyperfocal |  |  | 과초점거리 | 초점을 H에 두면 H/2부터 무한대까지 최대 심도 | H=L²/(f×d); FF 50mm f/8≈12m, 35mm f/8≈6.1m, 17mm f/8≈1.4m [C8][C10] | 근경·원경 동시 선명한 풍경 룩 | hyperfocal deep landscape, sharp near to infinity | 확정 [C8][C10][C11] | confirmed |
| bokeh |  |  | 보케 | 초점 밖 점광원이 착란원 원반으로 퍼진 흐림 | CoC 원반 지름 = 초점면 거리차에 비례 [C24] | 배경 하이라이트가 부드러운 원반으로 | creamy bokeh, soft rounded highlight discs | 유력 [C24] | probable |
| fast-lens-speed |  |  | 렌즈 스피드 | 최대 조리개가 큰 렌즈의 집광 능력 | Ray 'speed of a lens' 챕터 [C3] | 밝은 개방, 저조도 촬영, 얕은 심도 | fast lens wide open, low-light rendering | 확정 [C3][C5] | confirmed |
| diffraction-softening |  |  | 회절 연화 | 조리개를 과도하게 조이면 회절로 콘트라스트 저하 | f/11 부근부터 전 레벨 저하, 고해상 센서는 f/8 [C12] | 소구경에서 전반적 흐릿함, f/16이 f/1.4보다 열등 | diffraction softening at small aperture | 유력 [C12] | probable |
| focus-fall-off |  |  | 초점 이탈감 | 초점면에서 배경으로 흐림이 번지는 방식 | 표준 렌즈 특성 어휘 [C18] | 부드럽거나 급격한 초점 전이 | gradual focus fall-off, smooth transition to blur | 유력 [C18] | probable |
| focus-breathing |  |  | 포커스 브리딩 | 초점 이동 시 화각이 미세 변동 | 초점거리별 상이(35mm 중, 75/100mm 매우 낮음) [C19] | 초점 조정 시 프레임이 살짝 확대·축소 | minimal focus breathing | 유력 [C18][C19] | probable |
| focus-shift |  |  | 초점 이동 | 개방 시 구면수차로 실제 초점면이 이동 | 마이크로 콘트라스트 낮은 렌즈 동반 [C12] | 개방부에서 정밀 초점 어긋남, 부드러운 글로우 | wide-open spherical glow, focus shift | 유력 [C12] | probable |
| t-stop-vs-f-stop |  |  | T스톱/F스톱 | F는 기하학적 조리개비, T는 실측 투과 보정값 | 시네 렌즈 T표기 관행 [C16][C19] | 노출 일관성(시네), 심도 계산(사진) | rated T-stop cinema exposure | 유력 [C16] | probable |
| rack-focus | cp.rack-focus | canonical | 랙 포커스 | 초점을 한 피사체에서 다른 피사체로 이동(스틸은 선택 초점 대응) | (직접 근거 없음, Mercado 초점 축 언급) | 선택 초점으로 시선 유도 | selective focus pull, rack focus emphasis | pending(갭) | pending-gap |

### 3. C. 센서·포맷 · sensor / format

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| full-frame-look | 풀프레임 룩 | 36x24mm 기준 센서, 크롭 팩터 1 | CoC 0.025mm(≈0.03), 등가 기준 [C9][C23] | 표준 심도·화각의 기준선 | full-frame rendering, 35mm format look | 확정 [C7][C9][C23] | confirmed |
| aps-c-crop | APS-C 크롭 | 23.6x15.7mm, 크롭 팩터 1.5 | CoC 0.020mm, 55mm→대각 28.7° [C7][C9] | 화각 좁아짐, 깊은 심도 경향 | APS-C crop sensor field of view | 확정 [C7][C9] | confirmed |
| super35-look | 슈퍼35 룩 | 공칭 18x24mm 시네 포맷 | FF 대비 화각 약 1.5x 환산(공칭) [R1 부분] | 시네 표준 화각, 등가 조리개 약 T×1.4~1.5 | Super 35 cinema format framing | 유력 [C23], 단 심도차 정량은 반박 R1 | probable |
| medium-format-look | 미디엄 포맷 룩 | 6x6cm급 대형 센서 | CoC 0.045mm [C9] | 극도로 얕은 심도, 톤 전이 부드러움 | medium format look, ultra-smooth gradation, shallow rendering | 유력 [C9] | probable |
| large-format-look | 대형 포맷 룩 | 4x5인치 시트필름급 | CoC 0.1mm [C9] | 극단 심도 제어, PC 무브먼트 결합 | large format 4x5 rendering, view camera look | 유력 [C9] | probable |
| crop-factor | 크롭 팩터 | 포맷별 화각·등가 환산 배율 | FF=1, APS-C=1.5, CX 1인치=2.8 [C7] | 같은 렌즈가 좁은 화각으로 결상 | crop factor equivalent field of view | 확정 [C7], 등가 정규화 [C23] | confirmed |
| coc-per-format | 포맷별 착란원 | 허용 흐림 원반의 포맷 표준값 | FF 0.025, DX 0.020, 6x6 0.045, 4x5 0.1mm [C9] | 포맷이 클수록 얕은 심도로 인식 | (근거·계산 필드, 프롬프트 비노출 권장) | 유력 [C9] | probable |

### 4. D. 아나모픽 시그니처 · anamorphic

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2x-squeeze | 2배 스퀴즈 | 긴 축을 2배 압축 후 언스퀴즈하는 표준 아나모픽 | 스퀴즈 2.0x [C13] | 와이드 종횡비, 아나모픽 특유 룩 | 2x anamorphic squeeze, cinematic widescreen | 유력 [C13] | probable |
| 1.3x-squeeze | 1.3배 스퀴즈 | 약한 압축 대안, 픽셀 95% 보존 | 스퀴즈 1.3x [C13] | 미묘한 아나모픽 특성, 절제된 룩 | subtle 1.3x anamorphic character | 유력 [C13] | probable |
| oval-bokeh | 타원 보케 | 초점 밖 하이라이트가 세로 타원으로 결상 | 18매 조리개로 조여도 유지(테스트) [C14] | 세로로 늘어난 타원형 배경 하이라이트 | oval anamorphic bokeh, vertically stretched highlights | 유력 [C14] | probable |
| horizontal-blue-flare | 수평 청색 플레어 | 프레임을 가로지르는 푸른 수평 스트릭 | 통념상 수평 고정(B), 제조사는 수직도 가능(A) [C14] | 밝은 광원에서 가로로 뻗는 파란 광선 | horizontal blue anamorphic lens flare streak | 유력 [C14] | probable |
| vertical-streak | 수직 스트릭 | 제조사 1차 자료가 명시한 수직 방향 플레어 변형 | RED 101 '수평 또는 수직' [C14] | 세로 방향 광선 줄무늬 | vertical anamorphic flare streak | 유력 [C14] | probable |
| anamorphic-shallow-dof | 아나모픽 얕은 심도 | 동일 화각에 더 긴 초점거리를 써서 얕아지는 심도 | 화각 등가 조건 필수(무조건 아님) [C15] | 시네마틱한 얕은 배경 분리 | anamorphic shallow cinematic depth (matched field of view) | 유력 [C15] | probable |
| desqueeze | 디스퀴즈 | 압축 이미지를 후반·투영 단계에서 가로로 복원 | 필수 공정 [C13] | 정상 종횡비 복원 후 특성 발현 | desqueezed anamorphic frame | 유력 [C13] | probable |
| widescreen-2.39 | 2.39 와이드스크린 | 아나모픽이 목표하는 극와이드 종횡비 | 2.39:1 / 2.40:1 [풀] | 상하 좁은 시네마 스코프 프레임 | 2.39:1 anamorphic widescreen aspect | pending(풀) | pending-pool |

### 5. E. 렌즈 필터 · optical filters

| Keyword | Canonical ID | Relation | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| nd-filter |  |  | ND 필터 | 색을 안 바꾸고 광량만 감소 | ND4=OD0.6=25%투과=2스톱, 1스톱=OD0.3 [C21] | 밝은 곳에서 개방·장노출 가능 | neutral density filter, motion blur in daylight | 유력 [C21] | probable |
| nd-density-notation |  |  | ND 표기 체계 | 사진(Filter Factor)·시네(Optical Density) 이중 표기 | ND4 = ND0.6, F-stops/Factor/OD/Transmission 상호환산 [C21] | (검색·표기 필드) | (프롬프트 비노출) | 유력 [C21] | probable |
| pro-mist |  |  | 프로미스트 | 디테일 연화·콘트라스트 저하·하이라이트 국소 플레어 | 강도 1/16,1/8,1/4,1/2,1~5 [C22] | 부드러운 글로우, 두드러진 할레이션 | pro-mist diffusion, glowing highlights, soft halation | 유력 [C22] | probable |
| black-pro-mist |  |  | 블랙 프로미스트 | 콘트라스트 덜 낮추고 블랙 유지, 거즈 할레이션 | 강도 1/8·1/4 등, 고밀도일수록 warm [C22] | 블랙 유지된 부드러운 하이라이트 블룸 | black pro-mist 1/4, gentle highlight bloom, blacks retained | 유력 [C22] | probable |
| diffusion-soft-focus |  |  | 디퓨전·소프트포커스 | 미세 디테일을 부드럽게 하는 소프트포커스 렌즈/필터 | Ray soft focus lens 범주 [C1] | 몽환적 연화, 하이라이트 번짐 | soft focus diffusion, dreamy glow | 유력 [C1][C22] | probable |
| polarizer | cp.polarizer | canonical | 편광 필터 | 반사·눈부심 억제, 하늘 채도 증가 | (직접 근거 없음) | 반사 제거, 짙은 하늘, 채도 상승 | polarizer, deep saturated sky, reduced glare | pending(갭) | pending-gap |
| star-filter |  |  | 스타 필터 | 점광원을 방사형 별빛으로 회절 | (직접 근거 없음) | 하이라이트에서 뻗는 광선 별점 | star filter, radiating light spikes | pending(갭) | pending-gap |
| graduated-nd |  |  | 그라데이션 ND | 프레임 일부만 감광하는 점이 필터 | (직접 근거 없음) | 하늘만 어둡게, 노출 균형 | graduated ND, balanced sky exposure | pending(갭) | pending-gap |

### 6. F. 빈티지·시네 렌즈 계보 · lens lineage

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| zeiss-micro-contrast-pop | 자이스 마이크로 콘트라스트/팝 | 40 lp/mm 미세 디테일 콘트라스트가 만드는 입체감 | 마이크로=40lp/mm, 오버올=10~20lp/mm; MTF f/2.8 정점 [C12] | 3D pop, brilliance, bite, 입체적 분리감 | Zeiss micro-contrast pop, 3D rendering, crisp bite | 유력 [C12] | probable |
| cooke-look | 쿡 룩 | Cooke 렌즈 계보 특유의 온화한 결상 | Speed Panchro II/III 등재 [C17] | 부드러운 스킨톤, 온화한 콘트라스트 | Cooke look, gentle warm rendering, smooth skin | 유력 [C17][C19] | probable |
| k35-look | K35 룩 | Canon K35 빈티지 시네 프라임 특성 | 표준 테스트 등재 [C17] | 따뜻한 빈티지, 부드러운 플레어 | Canon K35 vintage cine look, warm soft flare | 유력 [C17] | probable |
| speed-panchro | 스피드 판크로 | Cooke Speed Panchro II/III 클래식 프라임 | 등재 목록 [C17] | 빈티지 콘트라스트, 부드러운 개방부 | Cooke Speed Panchro vintage character | 유력 [C17] | probable |
| panavision-auto-panatar | 파나비전 오토파나타 | 클래식 2x 아나모픽 계보 | 50mm T2.3 [C16] | 클래식 아나모픽 플레어·타원 보케 | Panavision Auto-Panatar classic anamorphic | 유력 [C16] | probable |
| master-anamorphic | 마스터 아나모픽 | ARRI/Zeiss 현대 클린 아나모픽 | 50mm T1.9 [C16] | 절제된 현대 아나모픽, 낮은 왜곡 | ARRI Master Anamorphic, clean modern anamorphic | 유력 [C16] | probable |
| kowa-anamorphic | 코와 아나모픽 | Kowa Cine Prominar 아나모픽 계보 | 50mm T2.3 [C16] | 강한 플레어·컬러 캐릭터 | Kowa anamorphic character flare | 유력 [C16] | probable |
| lomo-round-front | 로모 라운드프론트 | 소련제 2x 아나모픽(Hawk C-Series 원형) | 2x, 50mm T2.4, 18매 조리개 [C13][C16] | 완전 타원 보케, 개성적 왜곡 | LOMO Round-Front anamorphic, strong oval bokeh | 유력 [C16] | probable |
| iscorama-adapter | 이스코라마 어댑터 | 저가 스틸 렌즈에 아나모픽 룩을 주는 어댑터 | Pre-36, 약 $3,000 미만 [C16] | 저예산 아나모픽 스트릭·타원 | Iscorama adapter anamorphic look on still lens | 유력 [C16] | probable |
| warm-cine-rendering | 따뜻한 시네 렌더링 | 붉은 끝 투과 우세로 나타나는 렌즈 색 성향 | Samyang 붉은 우세, Schneider Cine-Xenar III warm [C20] | 미세한 따뜻한 틴트(강도 약) | subtly warm vintage cine color rendering | 유력 [C20] (강도 약 명시) | probable |
| helios-swirl-bokeh | 헬리오스 소용돌이 보케 | Helios 58mm 계열의 회전형 배경 흐림 | (직접 근거 없음) | 배경이 소용돌이치는 스월 보케 | Helios swirl bokeh, spinning background blur | pending(갭) | pending-gap |
| petzval-swirl | 페츠발 스월 | Petzval 설계의 강한 필드 곡률 스월 | (직접 근거 없음) | 중심 선명·주변 소용돌이 | Petzval lens swirl, sharp center spinning edges | pending(갭) | pending-gap |

### 7. G. 광학 아티팩트 · optical artifacts

| Keyword | Canonical ID | Relation | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lens-flare |  |  | 렌즈 플레어 | 강광원 입사 시 산란으로 생기는 광학 현상 | 수차·해상력과 분리된 독립 항목 [C2] | 광원에서 뻗는 고스트·헤일로 | lens flare, light streaks and ghosting | 유력 [C2] | probable |
| chromatic-aberration |  |  | 색수차 | 파장별 굴절 차로 생기는 색 번짐 | ED glass·회절광학으로 교정, 독립 챕터 [C2] | 고대비 경계의 청·자·녹 프린징 | chromatic aberration fringing on high-contrast edges | 유력 [C2] | probable |
| halation | cp.halation | canonical | 할레이션 | 하이라이트 주변 부드러운 붉은 번짐 | Pro-Mist에서 두드러짐 [C22] | 밝은 광원 둘레의 진주빛·붉은 후광 | halation glow, soft red bloom around highlights | 유력 [C22] | probable |
| vignetting |  |  | 비네팅 | 프레임 주변부 광량 저하로 어두워짐 | 표준 렌즈 특성 어휘 [C18] | 모서리가 중심보다 어두움 | natural lens vignetting, darkened corners | 유력 [C18] | probable |
| barrel-distortion |  |  | 배럴 왜곡 | 직선이 바깥으로 볼록하게 휘는 왜곡 | 광각·아나모픽 가장자리 [C18][풀] | 통 모양 팽창, 가장자리 곡률 | barrel distortion, bulging straight lines | 유력 [C18] | probable |
| color-cast |  |  | 컬러 캐스트 | 렌즈 투과 특성에 따른 전반적 색 편향 | 렌즈 간 편차 미세 [C20] | 미묘한 warm/cool 전체 톤 | subtle lens color cast | 유력 [C18][C20] | probable |
| micro-contrast-glow |  |  | 저콘트라스트 글로우 | 개방부 구면수차로 하이라이트가 부드럽게 번짐 | 마이크로 콘트라스트 낮은 렌즈 [C12] | 개방에서 몽환적 헤이즈·글로우 | wide-open glow, veiling spherical haze | 유력 [C12] | probable |
| vignetting-mount-crop |  |  | 이미지서클 비네팅 | 작은 이미지 서클 렌즈를 큰 포맷에 물릴 때 원형 암부 | S35 렌즈를 FF에 장착 시 [R1 유효부] | 프레임 네 귀 원형 검은 잘림 | image circle vignetting, dark rounded frame edges | 유력 [R1 유효부] | probable |

### 8. H. 스틸 사진의 모션 암시 · motion cues

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| long-exposure | 장노출 | 긴 노출시간으로 움직임을 흐름으로 기록 | 노출시간이 제어 파라미터 [C23] | 물·구름의 실크 흐름, 광선 궤적 | long exposure, silky motion trails, light streaks | 유력 [C23] | probable |
| panning-blur | 패닝 블러 | 이동 피사체를 따라가 배경만 흐리는 기법 | 셔터·이동 속도 함수 | 피사체 선명·배경 수평 흐름 | panning motion blur, sharp subject streaked background | pending(갭) | pending-gap |
| frozen-motion | 프로즌 모션 | 고속 셔터로 움직임을 정지 포착 | 짧은 노출시간 [C23] | 물방울·비산이 공중에 얼어붙음 | frozen motion, crisp frozen splash, high shutter | 유력 [C23] | probable |
| motion-blur-degree | 모션 블러 정도 | 노출 중 피사체 이동량이 만드는 흐림 강도 | 노출시간 비례 | 약한 잔상부터 완전 스미어까지 | subtle motion blur / heavy directional smear | 유력 [C23] | probable |

## Part 2: 조명

광원 속성 3분(밝기·색·대비), 물리 파라미터, 반사 관리(Family of Angles), 역할 기반 라이트, 조명비 (81개 키워드)

### 1. 조명의 보편 기능 · 상위 프레임

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| shadow (function) | 그림자 생성 | 조명의 1차 기능. 빛이 만드는 그림자로 형태를 규정 | 각도·크기 파라미터에 종속 | 방향성 있는 명부·암부 경계 | directional light casting defining shadows | 유력(A) [C1] | probable |
| separation (function) | 분리 | 명암 대비로 피사체에 3차원성을 부여, 배경과 떼어냄 | 조명비로 정량화 | 피사체 윤곽이 배경에서 도드라짐 | rim separation from background, dimensional depth | 유력(A) [C1] | probable |
| fill (function) | 채움 | 그림자 안을 얼마나 보이게 할지로 무드를 결정 | 조명비 낮을수록 채움 강함 | 암부 디테일 가시성 조절 | shadow fill controlling mood and detail | 유력(A) [C1] | probable |

### 2. 역할 기반 라이트

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| key light / main light | 주광 | 노출을 설정하는 주 조명원. 세기·색·각도가 샷 전체 설계를 결정. 한 프레임에 복수 key 존재 가능 | 워크숍 실측 예: key당 40fc → ISO500 T4 | 지배적 방향성, 하이라이트 위치 결정 | dominant key light defining exposure and mood | 유력(A) [C2] | probable |
| fill light | 보조광 | 그늘면을 비춰 대비를 낮추는 보조 조명. key의 최대 절반 밝기, 더 부드러움 | key보다 1.5~3스톱 낮음(실무), 절반 출력(1스톱, 3점 정의) | 암부 디테일 살아남, chiaroscuro 완화 | soft fill light lifting shadows, reduced contrast | 확정(A) [C3][C4][C20] | confirmed |
| back light | 백라이트 | 피사체 뒤에서 비춰 배경 분리용 빛 테두리 생성 | rim은 key보다 1~2스톱 밝게 | 어깨·머리 윤곽 하이라이트 | back light rim separating subject from background | 유력(A) [C5] | probable |
| rim light | 림 라이트 | 옆얼굴·윤곽에 얇은 빛 테두리. key와 카메라-피사체 축 사이 각도 >90°일 때 발생 | 각도 임계 >90°, key+1~2스톱 | 실루엣 가장자리 밝은 선 | thin rim light outlining profile edge | 유력(A) [C5] | probable |
| hair light | 헤어 라이트 | 머리카락 위쪽을 비춰 정수리·모발 광택 분리 | pending | 모발 상단 하이라이트 | hair light glinting on top of head | pending | pending-pool |
| shoulder light | 숄더 라이트 | back light 별칭. 어깨선 분리 | pending | 어깨 윤곽 밝은 선 | shoulder edge light | pending | pending-pool |
| kicker | 키커 | 후측면 하단에서 뺨·턱선에 좁은 반사 하이라이트 | pending(후측 45~135° 추정) | 얼굴 측면 좁은 광택 띠 | kicker light grazing cheekbone from behind | pending | pending-pool |
| background light | 배경광 | 배경 요소를 비춰 배경 그림자 제거·깊이 부여(four-point의 4번째) | pending | 배경 톤 상승, 피사체와 톤 분리 | background light adding depth behind subject | pending | pending-pool |
| cross-key / inside cross-keys | 크로스 키 | 두 인물을 교차로 서로의 key/back으로 쓰는 배치. inside cross-keys는 rim 유발(>90°) | 각도 >90° | 대화 장면 상호 rim | cross-key setup with wrap-around rim | 유력(B) [C5] | probable |
| flat lighting / on-axis | 플랫 라이트 | 렌즈 축과 동일선(on-axis)에서 오는 빛. 온카메라 플래시가 대표 | 카메라 축 0° | 균일·무입체, 그림자 소거 | flat on-axis frontal light, no modeling | pending | pending-pool |
| clamshell | 클램셸 | 위 key + 아래 보조(리플렉터/소스)의 조개 배치. 뷰티·미용 표준 | 하단 보조는 key보다 2~3스톱 낮게 | 부드러운 정면광 + 턱밑 채움, 눈밑 그림자 제거 | clamshell beauty lighting, soft even face | 유력(B) [C20] | probable |

### 3. 빛의 질: Hard vs Soft · 물리

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hard light | 하드 라이트 | 피사체 대비 작은 광원. 작은 광원을 멀리 둘수록 단단 | 태양=하늘의 0.5° 점광원 | 선명한 그림자 경계, 고대비, 질감·디테일 강조, 강한 방향성 | hard light, crisp sharp-edged shadows, high contrast, textured | 확정(A) [C8][C9][C11] | confirmed |
| soft light | 소프트 라이트 | 피사체 대비 큰 광원. 가까이 둘수록 부드러움 | 상대 크기 클수록 soft | 물체를 감싸는 wrap, 길고 완만한 그림자 전환, 저대비, 방향성 약함(sourceless) | soft light wrapping subject, gradual shadow transition, low contrast | 확정(A) [C8][C9][C10] | confirmed |
| relative source size | 상대 광원 크기 | soft/hard 판정 변수. 피사체에서 본 광원 각크기 | 20'x20'도 100' 거리면 작은 광원 | 거리에 따라 같은 광원이 hard↔soft 이동 | apparent source size relative to subject | 유력(A) [C8] | probable |
| shadow edge transfer | 그림자 가장자리 전환 | 빛과 그림자 사이 전환의 폭·성격. 빛의 질 정의 축 | 폭 넓을수록 soft | 그림자 경계의 흐림 정도 | shadow edge transition width | 유력(A) [C8] | probable |
| wrap | 랩(감쌈) | soft light가 곡면을 돌아 감싸는 성질 | pending 정량 | 얼굴 측면까지 빛이 돌아감 | light wrapping around the face | 유력(B) [C9][C24] | probable |
| diffusion | 디퓨전 | 광원보다 큰 확산재로 새 광원 면적 확대. 광원에서 멀수록 soft | 렌즈면 부착만으론 질 불변 | 부드러운 확산광 | large diffusion frame softening the source | 유력(A) [C10] | probable |
| falloff / inverse-square | 감쇠·역제곱 | I=1/d². 거리 2배=1/4(2스톱), ×√2=1스톱. **주의: soft/큰 광원은 역제곱보다 느리게(gentler) 감쇠** | 1K 오픈페이스 4'=1000fc, 8'=250fc | 광원 가까울수록 급격한 톤 감쇠 | steep light falloff near source | 유력(B), 단 R1 예외조항 반전 주의(4장 참조) | probable |

### 4. 조명비·대비 정량

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| lighting ratio | 조명비 | (key+Σfill):Σfill. 높을수록 고대비 | key 200fc+fill 100fc = 3:1. 조명비=2^(스톱차) | 명부/암부 밝기 격차 | X:1 lighting ratio | 유력(A) [C6] | probable |
| key-to-fill ratio | 키-필 비율 | key:fill 관행(입사광 2회 측정). ASC (key+fill):fill 공식과 숫자 다름 | 표기 관행 병기 필수 | 위와 유사, 측정 관행 차이 | key-to-fill ratio measured | 유력(A) [C7] | probable |
| 2:1 (1-stop) | 2대1 저대비 | 1스톱 차 조명비 | 2^1 | 부드러운 저대비, 그림자 얕음 | 2:1 ratio, gentle low-contrast portrait | 유력(A) [C6] | probable |
| 3:1 (comedy look) | 3대1 코미디 룩 | key:fill 3:1, 저대비 시트콤 톤('Laverne & Shirley') | key:fill 관행 | 밝고 평탄, 유쾌 | bright low-contrast sitcom lighting | 유력(B) [C7] | probable |
| 4:1 (2-stop) | 4대1 자연 대비 | 2스톱 차, 자연스러운 인물 대비 | 2^2 | 뚜렷하나 암부 디테일 유지 | 4:1 natural portrait contrast | 유력(A) [C6] | probable |
| 8:1 (dramatic) | 8대1 드라마틱 | 밝지만 모델링 살고 검은 기준(머리카락) 유지 | key:fill 관행 | 강한 입체·검은 암부 유지 | 8:1 dramatic modeling, deep blacks | 유력(B) [C7] | probable |
| no-fill (foreboding) | 무필·불길 | fill 생략, 암부 완전 소거 | 조명비 최대 | 불길·긴장, 야간 검은 볼륨 | no fill, ominous deep shadows | 유력(A) [C7] | probable |
| high-key | 하이키 | 저조명비·밝은 톤 지배, 그림자 최소 | pending(정량 미확정, 통상 ≤2:1) | 밝고 화사, 암부 거의 없음 | high-key bright airy lighting, minimal shadow | pending | pending-pool |
| low-key | 로우키 | 고조명비·암부 지배, 극적 명암 | 고대비, 흑백 영화 극단형 | 어두운 화면에 선택적 하이라이트 | low-key dramatic lighting, dominant shadow | 유력(B) [C21] | probable |

### 5. 인물 조명 셋업

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Rembrandt lighting | 렘브란트 | 그림자 쪽 눈밑 삼각형 하이라이트 생성. chiaroscuro의 사진적 구현 | 눈밑 엄지크기 삼각형 패치, 극적 입체 | Rembrandt lighting, triangular cheek highlight, dramatic | 유력(B) [C15] | probable |
| Rembrandt patch | 렘브란트 패치 | 시그니처 삼각형. 기하 규격 있음 | 그림자 뺨의 밝은 삼각형 | small triangular light patch under eye | 유력(B) [C15] | probable |
| butterfly / paramount | 버터플라이·파라마운트 | 정면 온액시스 상방 key, 코밑 대칭 나비 그림자 | 코 바로 아래 나비형 대칭 그림자, 글래머 | butterfly lighting, symmetrical under-nose shadow, glamour | 유력(B) [C16] | probable |
| loop lighting | 루프 | 코 옆 작은 고리 그림자. 뺨에 닿기 직전 | 코 옆 짧은 고리 그림자(뺨 미접촉) | loop lighting, small nose-side loop shadow | 유력(B) [C17] | probable |
| split lighting | 스플릿 | 얼굴을 50/50 명암 이등분 | 얼굴 절반 빛·절반 그림자, 강렬 | split lighting, half face lit half in shadow | 유력(B) [C18] | probable |
| broad lighting | 브로드 | 카메라에 가까운 뺨을 밝힘. 얼굴 넓어 보임 | 넓은 명부, 피처 완화 | broad lighting, near cheek lit, fuller face | 유력(B) [C19] | probable |
| short lighting | 쇼트 | 카메라에서 먼 쪽 뺨을 밝힘. 얼굴 슬림·깊이 | 좁은 명부, 슬림·입체 | short lighting, far cheek lit, slimming depth | 유력(B) [C19] | probable |
| catchlight | 캐치라이트 | 눈동자 속 광원 반영. 생기 지표 | 눈동자 반짝임 위치 | catchlight at 10 o'clock in the eyes | 유력(B) [C20] | probable |

### 6. 모디파이어별 시각 시그니처

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| softbox | 소프트박스 | 확산재로 광원 면적 확대. 크기·거리로 softness 조절 | 거리>크기면 hard화(2'+에서 하드화) | 사각 캐치라이트, 부드러운 그림자 | softbox, soft directional light, rectangular catchlight | 유력(B) [C10] | probable |
| octabox | 옥타박스 | 대형 8각 소프트박스. 자연스러운 원형 캐치라이트 | 대형=강한 wrap | 원형 캐치라이트, 강한 감쌈 | octabox, large soft wraparound light, round catchlight | 유력(B) [C24] | probable |
| strip box / strip softbox | 스트립 박스 | 좁고 긴 소프트박스. 측면·엣지·헤어용 | pending | 길고 좁은 하이라이트 띠 | strip softbox, long narrow highlight | pending | pending-pool |
| beauty dish | 뷰티 디시 | soft와 hard 사이 중간 경도. 옥타박스만큼 wrap 안 함 | 그림자 뚜렷, 대비 폭 넓음 | 반짝이는 중간 대비, 뚜렷한 그림자 | beauty dish, punchy mid-contrast, distinct shadow | 유력(B) [C24] | probable |
| umbrella | 엄브렐러 | 반사·투과 확산. 광범위 저제어 부드러움 | pending(shoot-through vs reflective) | 넓게 퍼진 부드러움, 스필 많음 | umbrella light, broad soft spread | pending | pending-pool |
| honeycomb grid | 허니콤 그리드 | 빔 각 좁힘. 가장자리 그라데이션 우아 | pending(도 단위) | 부드럽게 감쇠하는 원형 스팟 | grid spot, soft-edged pool of light | 유력(B) [C22] | probable |
| egg crate | 에그크레이트 | 소프트박스 전면 그리드. 빔 좁힘+스필 감소 | pending | 방향성 강화된 부드러운 빛 | egg crate grid controlling spill | 유력(B) [C23] | probable |
| snoot | 스누트 | 관 형태로 좁은 빔. 길수록 타이트 | 6/8/12인치, 가장자리 falloff 급격(abrupt) | 작고 급격히 끊기는 원형 스팟 | snoot, tight spotlight, abrupt edge falloff | 유력(B) [C22] | probable |
| barn doors | 반돌 | 전면 금속 플랩으로 빔 성형·차광 | pending | 직선 경계로 잘린 빛 | barn doors shaping the beam | 유력(B) [C23] | probable |
| flag / gobo | 플래그·고보 | 부분 차광. 플레어 방지·확산 제한·배경 차광 | pending | 빛의 국부 차단, 부분 암부 | flag blocking spill, controlled shadow | 유력(B) [C22][C23] | probable |
| negative fill | 네거티브 필 | 검은 표면(듀브틴·V-flat)으로 빛 흡수, 그림자 강화 | pending | 한쪽 암부 심화, 입체 강조 | negative fill deepening one-side shadow | 유력(B) [C23] | probable |
| scrim | 스크림 | 와이어 메시. 질 불변, 세기만 감소(반증 가능성 있음) | 세기만 감소 | 밝기만 낮아짐 | scrim reducing intensity | 유력(B) [C23], 정의 재검증 필요 | probable |
| silk | 실크 | 대형 확산 원단. 부드럽게 넓게 퍼뜨림 | pending | 넓은 부드러운 확산 | silk diffusion, broad soft light | 유력(B) [C23] | probable |
| cookie / cucoloris | 쿠키·쿠컬로리스 | 무작위 컷아웃 판. 나뭇잎 사이 빛 같은 얼룩 패턴 | pending | dappled 얼룩 그림자 패턴 | cucoloris, dappled leafy shadow pattern | 유력(B) [C23] | probable |
| fresnel | 프레넬 | 초점 조절(스팟↔플러드) 렌즈 기구. 부드럽고 균일 빔 | pending | 균일·초점 조절 가능한 빔 | fresnel focusable even beam | pending | pending-pool |
| open face | 오픈 페이스 | 렌즈 없는 기구. 딱딱·덜 제어 빔 | pending | 거친 방향성 빔 | open-face light, hard uncontrolled beam | pending | pending-pool |
| duvetyne | 듀브틴 | 무겁고 검은 무광 원단. 차광·네거티브 필 재료 | pending | (도구, 결과는 negative fill) | duvetyne blackout fabric | pending | pending-pool |
| reflector / bounce | 리플렉터·바운스 | 흰 판·벽으로 key 되받아 부드러운 fill 대체 | pending | 부드러운 채움광 | bounce reflector soft fill | 유력(A) [C3] | probable |
| feathering | 페더링 | 빔 가장자리를 써서 불균일 조명 | 평면 전면 모디파이어에서 용이 | 완만한 밝기 그라데이션 | feathered light edge, gradient falloff | pending | pending-pool |

### 7. 자연광·시간대

| Keyword | Canonical ID | Relation | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| direct sunlight |  |  | 직사광 | 지름 864,600마일이나 하늘 0.5° 점광원. 가장 단단한 자연광 | 선명한 그림자, 강한 대비 | harsh direct sunlight, sharp hard shadows | 확정(A) [C11][C12] | confirmed |
| overcast |  |  | 흐린 날 | 구름이 180° 반구를 광원으로. 자연의 softbox | 그림자 거의 없는 균일 확산광 | overcast soft diffused light, shadowless | 확정(A) [C11][C12] | confirmed |
| golden hour / magic hour | cp.golden-hour | canonical | 골든아워·매직아워 | 일출 직후·일몰 직전 낮고 붉고 부드러운 빛 | 길게 늘어진 그림자, 따뜻한 황금빛 | golden hour, warm low-angle sunlight, long shadows | 유력, 참고(C) [C13] | probable |
| blue hour | cp.blue-hour | canonical | 블루아워 | 태양이 지평선 아래, 잔광이 청색 지배, 날카로운 그림자 전무 | 푸른 무그림자 박명 | blue hour, cool blue twilight, no harsh shadows | 유력, 참고(C) [C14] | probable |
| open shade |  |  | 오픈 셰이드 | 직사 없는 그늘, 하늘 반사 청색광 | 부드럽고 푸른빛 도는 그늘 | open shade, soft cool-blue skylight | 유력, 참고(C) [C12] | probable |
| window light |  |  | 윈도우 라이트 | 창을 통과한 방향성 부드러운 실내 자연광 | 한쪽 방향 부드러운 falloff, 실내 무드 | soft directional window light indoors | pending | pending-pool |
| dappled light |  |  | 대플드 라이트 | 나뭇잎 사이로 얼룩진 자연광(쿠키와 동형) | 밝고 어두운 얼룩 패턴 | dappled light through leaves | pending | pending-pool |

### 8. 색온도 앵커 · Kelvin 사다리

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| color temperature | 색온도 | 광원 색을 Kelvin으로 정량화하는 축 | 전체 색조 결정 | color temperature in Kelvin | 유력(A) [C12] | probable |
| candle / sunrise-sunset | 촛불·일출일몰 | 가장 따뜻한 대역 | 짙은 주황빛 | 1850K warm candlelit glow | 유력(A) [C12] | probable |
| tungsten / studio lamp | 텅스텐·스튜디오 램프 | 백열 스튜디오 촬영 조명 | 따뜻한 실내 주광 | 3200K tungsten warm light | 유력(A) [C12] | probable |
| daylight / electronic flash | 데이라이트·플래시 | 수직 낮 햇빛·전자 플래시 기준 | 중립 백색 | 5600K neutral daylight | 유력(A) [C12] | probable |
| clear-sky shade | 맑은 하늘 그늘 | 청색 반사광, 가장 차가운 자연광 | 강한 청색 캐스트 | cool blue open-shade cast | 유력(A) [C12] | probable |
| warm vs cool | 웜·쿨 명명 | 물리 온도 아닌 심리적 색 연상 | 정서적 색 무드 | warm amber tone / cool blue tone | 유력(A) [C12] | probable |

### 9. 광원 성격·동기 · Motivated / Practical / Available

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| practical light | 프랙티컬 | 화면 안에 보이는 실사용 조명기구(램프·촛대 등). 원칙상 디머 연결 | 디머 제어 원칙 | 프레임 내 발광 소품 | practical lamp in frame as light source | pending | pending-pool |
| motivated light | 모티베이티드 | 화면 내 광원이 동기가 된 것처럼 배치한 조명 | pending | 논리적 방향·색과 일치 | motivated lighting matching in-scene source | pending | pending-pool |
| available / natural light | 어베일러블·자연광 | 현장에 이미 있는 빛만으로 촬영 | pending | 인위적 셋업 없는 자연스러움 | available light, natural existing illumination | pending | pending-pool |

### 10. 시네마틱 조명

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| chiaroscuro | 키아로스쿠로 | chiaro(밝음)+scuro(어둠). 명도 그레이데이션과 빛·그림자 분할로 3D 볼륨 암시 | 고대비 low-key | 강한 명암 모델링, 볼륨감 | chiaroscuro, strong light-dark modeling | 유력(A) [C21] | probable |
| tenebrism | 테네브리즘 | 단일 제한된(종종 비가시) 광원의 한 줄기로 어두운 피사체 극적 조명(카라바조) | 극단 조명비, 배경 암흑 | 검은 배경에 한 줄기 스포트 | tenebrism, single dramatic beam, dark background | 유력(A) [C21] | probable |
| low-key noir | 로우키 누아르 | 흑백 영화 극단적 low-key 고대비. Toland·독일 표현주의 계보 | 고조명비, no/low fill | 짙은 그림자, 블라인드 줄무늬, 창문 key | film noir low-key, venetian-blind shadows | 유력(A) [C21] | probable |
| Rembrandt as chiaroscuro | 렘브란트=키아로스쿠로 사진판 | chiaroscuro의 사진적 구현 형태 | 5장 Rembrandt 참조 | 눈밑 삼각형+극적 명암 | photographic chiaroscuro portrait | 유력(A) [C21] | probable |
| silhouette | 실루엣 | 배경만 밝히고 피사체를 검은 형태로 | pending(백라이트 노출비) | 윤곽만 남은 검은 형태 | backlit silhouette against bright background | pending | pending-pool |
| backlit | 백릿 | 후방 광원으로 윤곽·역광 강조 | pending | 가장자리 발광, 반투명 후광 | backlit subject with glowing edges | 유력(B) [C5] | probable |
| god rays / crepuscular | 갓레이·박명광선 | 안개·먼지 속 가시 광선 다발 | pending | 방사형 가시 빛줄기 | volumetric god rays through haze | pending | pending-pool |
| volumetric / atmospheric | 볼류메트릭·대기광 | 안개·연무로 빛 경로를 가시화 | pending | 공기 중 빛 기둥·연무 | volumetric light beams in atmospheric haze | pending | pending-pool |

## Part 3: 색

색온도(Kelvin, CTB/CTO 젤 체계), 색관리(ASC CDL·ACES), 그레이딩 룩, 필름 스톡의 색 재현 (52개 키워드)

### 1. 슬롯 A: 색온도·화이트밸런스 축

| Keyword | Canonical ID | Relation | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mired axis |  |  | 미레드 축 | 색온도 보정의 기준 축. 1,000,000/Kelvin 로 정의되어 광원 온도와 무관한 상수라 가산·감산이 가능하다 | 3200K=313 mired, 5700K=175 mired. 예: 3/4 CTB(-112)=1/4 CTB(-35)+1/2 CTB(-78) [C1] | 젤 조합 예측의 선형 축 | (개념 축, 프롬프트 토큰 아님) | 확정 [C1][C13-box] | confirmed |
| Full CT Blue (CTB 201) |  |  | 풀 CTB | 텅스텐을 데이라이트 색온도로 올리는 파랑 보정 젤 | LEE 201: mired **-137**, 3200K→5700K, 투과율 34~35%, 약 2스톱 손실 [C2][C3] | 따뜻한 실내광을 차가운 창밖광에 매칭, 파란 캐스트 | tungsten corrected to daylight, cool blue color balance | 확정 [C2][C3] | confirmed |
| CTB fraction ladder |  |  | CTB 분수 사다리 | Full/Half/Quarter/Eighth 강도 단계 | LEE: Full(201)-137, 3/4(281)-112, 1/2(202)-78, 1/4(203)-35, 1/8(218)-18 mired [C3] | 강도별 점진적 쿨링 | quarter CTB subtle cool shift | 유력 [C3] | probable |
| Full CT Orange (CTO 204) |  |  | 풀 CTO | 데이라이트를 텅스텐 색온도로 내리는 앰버 보정 젤 | LEE 204: mired **+159**, 투과율 약 55%(약 0.7~1스톱). Rosco 3407: +167, 6500K→3200K, 47% [C4] | 차가운 광을 따뜻한 앰버로, 골든 캐스트 | daylight warmed to tungsten, warm amber color balance | 유력 (mired 확정, 명칭·노출 교정: R1) | probable |
| CTO fraction ladder |  |  | CTO 분수 사다리 | Full/3/4/Quarter/Eighth 앰버 강도 단계 | Full(204)+159, 3/4(285)+124, 1/2(205)+109, 1/4(206)+64, 1/8 CTStraw(444)+20 mired [C4, R1-검증] | 강도별 점진적 워밍 | quarter CTO subtle warm shift | 유력 (mired 확정: R1) | probable |
| CT Straw (CTS) |  |  | CT 스트로 | CTO보다 더 노랗고 덜 붉은 warming 젤. blue-amber 축 소속 (green-magenta 아님) | Rosco 3441: mired +160, 5500K→**2900K**(3200K 아님), 투과율 50%, -1.0스톱, 1992 도입 [R2-교정] | 촛불·실용램프·유등 모사, 노란 warm | warm straw practical lamp, candlelight tone | 유력 (색온도 타깃 교정: R2) | probable |
| warm cast |  |  | 웜 캐스트 | 낮은 색온도로 이미지 전체가 주황·황색으로 치우친 상태 | 3200K 이하 텅스텐/촛불 영역 [C1] | 아늑함·향수·석양 인상 | warm color cast, golden tungsten glow | 유력 | probable |
| cool cast |  |  | 쿨 캐스트 | 높은 색온도로 이미지가 청색으로 치우친 상태 | 6500K 이상, 스카이라이트 10,000~16,000K [IATSE-pending] | 차갑고 임상적·야간 인상 | cool blue cast, overcast daylight | 유력 | probable |
| mixed lighting |  |  | 혼합 조명 | 색온도가 다른 광원이 한 프레임에 공존해 캐스트가 갈라지는 상태 | 텅스텐 3200K + 창밖 데이라이트 5600K 공존 [C1] | 창가 주황, 그늘 파랑의 색 분리 | mixed lighting, warm interior and cool window light | 유력 | probable |
| tungsten/daylight cross |  |  | 텅스텐·데이라이트 크로스 | 필름/센서 밸런스와 반대 광원으로 촬영해 의도적 캐스트를 남기는 기법 | Portra 400 텅스텐 3200K에서 80A로 ISO 100, Pro 400H는 80A로 ISO 100/21° [C8][C13] | 전면 청색(텅스텐 필름 데이라이트) 또는 앰버 | tungsten film shot in daylight, blue color shift | 확정 [C8][C13] | confirmed |
| high-kelvin skylight |  |  | 하이켈빈 스카이라이트 | 그늘·구름 반사광의 초고색온도 영역 | 10,000~16,000K, 12,000K 매칭에 220+ mired 변환 필요 [IATSE-pending] | 짙은 청색 그늘, 차가운 야외 | deep blue shade, high color temperature skylight | 유력 | probable |
| golden hour | cp.golden-hour | cross-reference | 골든아워 | 일출·일몰 직후 저각도 태양광의 따뜻한 시간대 | 약 3000~4000K 등가 warm [C20] | 길게 늘어진 그림자, 황금빛 림라이트 | golden hour lighting, warm low sun | 유력, 모델 한정 참고 [C20] | probable |
| blue hour | cp.blue-hour | cross-reference | 블루아워 | 일몰 후 잔광의 차가운 청색 시간대 | 데이라이트 상단~스카이라이트 영역 [C20] | 짙은 청색 하늘, 인공광 대비 | blue hour twilight, deep blue ambient | 유력, 모델 한정 참고 [C20] | probable |

### 2. 슬롯 B: green-magenta 축

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| plus green / minus green | 플러스/마이너스 그린 | 플랑크 궤적을 벗어나는 색보정 축. 색온도와 독립적으로 초록↔마젠타를 조정 | 245 Half Plus Green=CC15 green, 248 Half Minus Green=CC15 magenta. 통과 후 색온도 daylight 6774K/tungsten 3200K 불변 [C7] | 색온도는 그대로 두고 초록/마젠타만 이동 | green-magenta tint shift, off-axis color correction | 확정 [C5][C7] | confirmed |
| Minusgreen gel | 마이너스그린 젤 | 형광·HMI의 초록 캐스트를 제거하는 마젠타 젤 | Tough Minusgreen 3308: 초록 제거로 형광을 5500K 데이라이트로, 투과율 55%. 30M=full, 15M=half [C5][C6] | 초록기 제거, 자연 피부톤 복원 | minus green correction, removed fluorescent green cast | 확정 [C6] | confirmed |
| Plusgreen gel | 플러스그린 젤 | 데이라이트/텅스텐 광원에 초록을 더해 형광에 맞추는 젤 | Tough Plusgreen 3304: CC30 Green급, 투과율 76% [C6] | 의도적 초록 캐스트 부여 | plus green tint, fluorescent-matched green | 유력 [C6] | probable |
| Fluorofilter | 플루오로필터 | 초록 제거와 색온도 하강을 동시에 해 형광을 텅스텐으로 렌더 | Rosco 3310: 형광→3200K 텅스텐, 투과율 36% [C6] | 초록 제거 + 따뜻한 텅스텐 톤 | fluorescent converted to tungsten, warm neutral | 유력 [C6] | probable |
| CC magenta / CC green units | CC 마젠타/그린 단위 | 컬러미터가 판독하는 green-magenta 보정 강도 단위 | 30M=full minus green, 15M=half minus green. Vision3 형광 보정에 CC magenta 성분 포함 [C5] | 정량 tint 강도 스케일 | (개념 단위, 프롬프트 토큰 아님) | 유력 [C5] | probable |
| fluorescent green cast | 형광 초록 캐스트 | 비연속 스펙트럼 광원(형광·수은·나트륨)이 만드는 원치 않는 초록기 | Rosco 1970년대 초 Minus/Plusgreen 개발 계기 [C5] | 얼굴·흰벽의 병색 초록 오염 | fluorescent green cast, sickly green tint | 유력 [C5] | probable |

### 3. 슬롯 C: 그레이딩 룩 계보

| Keyword | Canonical ID | Relation | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| teal and orange |  |  | 틸 앤드 오렌지 | 하이라이트/스킨을 주황, 섀도를 청록으로 미는 상보색 그레이드 | (정량 근거 없음, MJ 토큰 부재) [C20] | 따뜻한 피부 대 차가운 배경의 색 분리 | teal and orange color grade, complementary split | 유력, 근거 약함 [C20] | probable |
| bleach bypass |  |  | 블리치 바이패스 | 표백을 약화·생략해 은결정을 컬러 염료와 함께 잔류시키는 기법(동의어: skip bleach, silver retention) | 채도↓, 관용도↓, 대비↑, 그레인↑ [C15] | 뮤트 컬러 + 깊은 블랙, 흑백이 컬러 위에 겹친 효과 | bleach bypass, desaturated high contrast, silver retention | 확정 [C15][C16] | confirmed |
| silver retention (ENR/ACE/CCE) |  |  | 실버 리텐션 | 은 잔류량으로 대비·채도·그레인·블랙밀도 4요소를 제어하는 인화 공정군 | 'ENR 60%'=1000nm IR 밀도 0.60. full bypass=IR 240(약 4배 은), CCE=IR 180~190(약 75%), ACE 30/40/60% 조절 [C16] | 강도별 탈채도·블랙 심화 (Saving Private Ryan 얼굴 탈채도) | silver retention process, deep crushed blacks | 유력 [C16] | probable |
| cross-process |  |  | 크로스 프로세스 | 필름을 규정 외 현상액으로 처리해 색편이·대비 왜곡을 얻는 기법 | (정량 근거 없음, MJ 토큰 부재) [C20] | 시안/옐로 시프트, 하이 콘트라스트, 형광 하이라이트 | cross-processed film, shifted colors, high contrast | 유력, 모델 한정 참고 [C20] | probable |
| day-for-night |  |  | 데이 포 나이트 | 주간 촬영을 야간처럼 렌더하는 기법(별칭 la nuit américaine) | 약 2 f-stop 언더(ND로 조리개 유지), 3200K 텅스텐 필름이 비조명 영역을 moonlight blue로. blue cast 근거는 Purkinje effect [C17] | 어두운 청색 톤, 인공광만 흰색, 달빛 블루 | day for night, moonlight blue underexposed | 유력 [C17] | probable |
| film noir tone |  |  | 필름 누아르 톤 | 저조도(low-key) 흑백 시각 스타일 | 독일 표현주의 촬영술 계보, John Alton 'light-in-darkness', 용어는 1946 Nino Frank [C18] | 극적 하드 섀도, 고대비 흑백, 실루엣 | film noir lighting, low-key high-contrast black and white | 확정 [C18], MJ 토큰 [C20] | confirmed |
| desaturated / muted |  |  | 탈채도·뮤트 | 채도를 낮춰 절제된 색조로 만드는 그레이드 | bleach bypass 시그니처의 일부 [C15] | 흐릿하고 회색빛 도는 색, 낮은 채도 | desaturated muted color palette, low saturation | 유력 [C15] | probable |
| high saturation commercial |  |  | 고채도 커머셜 | 제품·광고용으로 채도를 끌어올린 선명한 룩 | Velvia RMS 9 고채도, Velvia 100 초고채도 등가 [C12] | 강렬한 원색, 임팩트 있는 제품 색 | high saturation commercial, punchy vivid colors | 유력 [C12] | probable |
| color grading |  |  | 컬러 그레이딩 | 이미지 전체 색·톤을 후반에서 조정하는 작업 총칭 | MJ 스타일 토큰 등재 [C20] | 통일된 색조 무드 | cinematic color grading | 유력, 모델 한정 참고 [C20] | probable |
| split toning | cp.split-toning | canonical | 스플릿 토닝 | 하이라이트와 섀도에 서로 다른 색조를 입히는 기법 | MJ 스타일 토큰 등재 [C20] | 하이라이트 웜/섀도 쿨 등 분리 | split toning, warm highlights cool shadows | 유력, 모델 한정 참고 [C20] | probable |
| cinematic haze | cp.cinematic-haze | canonical | 시네마틱 헤이즈 | 대기감·플레어로 채도와 대비를 부드럽게 낮춘 룩 | MJ 스타일 토큰 등재 [C20] | 뿌연 안개감, 낮은 대비, 빛 번짐 | cinematic haze, atmospheric glow | 유력, 모델 한정 참고 [C20] | probable |
| ASC CDL / ACES / LUT |  |  | 색관리 용어(CDL/ACES/LUT) | 후반 색보정·색공간 관리의 산업 표준 데이터 포맷 | MJ 토큰 카탈로그에 **부재**, 대신 Gamma/White Balance 토큰만 존재 [C20] | (프롬프트 시각 효과 불명) | applied LUT color grade (실효성 미검증) | 유력, 모델별 실효성 확인 필요 [C20] | probable |

### 4. 슬롯 D: 필름 스톡 시그니처

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Kodak Portra 400 | 코닥 포트라 400 | 뛰어난 스킨톤·채도의 true ISO 400 컬러 네거티브 | ISO 400(daylight), 텅스텐 80A로 100. C-41. PGI 135판 8x10=59 [C8][C9] | 부드러운 파스텔 피부톤, 넓은 관용도 | Kodak Portra 400, soft skin tones, natural color | 확정 [C8][C9][C10] | confirmed |
| Kodak Portra 160 | 코닥 포트라 160 | Portra 라인 저감도 버전, 최미세 그레인 | ISO 160, C-41 (MJ는 'Kodak Portra' 단일 토큰) [C19] | 가장 고운 그레인, 절제된 파스텔 | Kodak Portra 160, fine grain pastel | 유력, 모델 한정 참고 [C19] | probable |
| Kodak Portra 800 | 코닥 포트라 800 | Portra 라인 고감도 버전, 저광량 대응 | ISO 800, C-41 (MJ는 ISO 세분 토큰 없음) [C19] | 약간 굵은 그레인, 웜 스킨톤 유지 | Kodak Portra 800, low light warm skin | 유력, 모델 한정 참고 [C19] | probable |
| Kodak Ektar 100 | 코닥 엑타 100 | 최고 채도·최미세 그레인의 ISO 100 컬러 네거티브 | ISO 100, C-41. MJ 독립 토큰 [C19] | 강렬 채도, 매우 고운 그레인, 풍경·제품 | Kodak Ektar 100, ultra vivid fine grain | 유력 (MJ 토큰 [C19]) | probable |
| Kodak Gold 200 | 코닥 골드 200 | 따뜻한 톤의 소비자용 ISO 200 컬러 네거티브 | ISO 200, C-41. MJ 독립 토큰 [C19] | 노스탤직 웜 골든 톤, 중간 그레인 | Kodak Gold 200, warm nostalgic tones | 유력 (MJ 토큰 [C19]) | probable |
| Kodak Tri-X 400 | 코닥 트라이-X | 고대비 클래식 흑백 필름 | ISO 400. MJ 'Tri-X 400 TX' 토큰 [C19] | 굵은 그레인, 강한 대비, 다큐 흑백 | Kodak Tri-X 400, gritty high-contrast black and white | 유력 (MJ 토큰 [C19]) | probable |
| Kodak Vision3 500T | 코닥 비전3 500T | 텅스텐 3200K 밸런스 시네마 컬러 네거티브 | EI 텅스텐 500/데이라이트 320(85 필터), +/-**150K** 무보정, 2스톱 확장 하이라이트 [C11, R3-교정] | 스킨톤 강점, 저조도, rem-jet 백킹 | Kodak Vision3 500T, cinematic tungsten balance | 유력 [C11] (색온도 관용치 교정: R3) | probable |
| Fuji Velvia (RVP) | 후지 벨비아 | 초고채도 데이라이트 리버설(슬라이드) 필름 | ISO 50급, RMS 9 [C12] | 강렬한 원색, 짙은 그린·레드, 풍경 | Fuji Velvia, ultra-saturated landscape slide film | 유력 [C12] | probable |
| Fuji Velvia 100 | 후지 벨비아 100 | 신세대 커플러의 초고채도 리버설 | ISO 100, RMS 8, +1 push [C12] | 초고채도, 고운 그레인 | Fuji Velvia 100, vivid high saturation | 유력 [C12] | probable |
| Fuji Velvia 100F | 후지 벨비아 100F | 100F 시리즈 중 최고 채도·고대비 | RMS급 미세, 혼합광·형광 색오염 최소 [C12] | 최고 채도, 보라·녹색 충실 | Fuji Velvia 100F, highest saturation high contrast | 유력 [C12] | probable |
| Fuji Provia 100F | 후지 프로비아 100F | 중간 채도·대비의 표준 리버설 | ISO 100, RMS 8, +2 push [C12] | 자연스러운 채도, 중립 대비 | Fuji Provia 100F, balanced natural slide film | 유력 [C12] | probable |
| Fuji Astia 100F | 후지 아스티아 100F | 최연질 톤·스킨톤 연속성의 리버설 | ISO 100, RMS 7 [C12] | 부드러운 톤, 매끄러운 피부, 패션·인물 | Fuji Astia 100F, soft muted skin tones | 유력 [C12] | probable |
| Fuji Provia 400F | 후지 프로비아 400F | ISO 400급 최미세 그레인 리버설 | ISO 400, RMS 13, +3~3.5 push [C12] | 고채도, 400급 고운 그레인 | Fuji Provia 400F, fine grain saturated | 유력 [C12] | probable |
| Fujicolor Pro 400H | 후지컬러 프로 400H | 4번째 색층의 ISO 400 데이라이트 컬러 네거티브 | ISO 400/27°, 확산 RMS 4, 텅스텐 80A로 100/21° [C13] | 부드러운 파스텔, 민트빛 그린, 웨딩 스킨톤 | Fuji Pro 400H, pastel airy skin tones | 유력 [C13] | probable |
| Fuji Superia / Reala | 후지 수페리아/리얼라 | 소비자용 컬러 네거티브, Reala는 4색층 | Superia MJ 독립 토큰. Reala 형광 아래 색 충실 [C19] | 시원한 그린·시안 시프트, 일상 스냅 | Fujifilm Superia, cool green color shift | 유력 (MJ 토큰 [C19]) | probable |
| Cinestill 500T | 시네스틸 500T | Vision3 500T의 rem-jet을 제거한 데이라이트 현상용 필름 | 모체 Vision3 500T(텅스텐 3200K) [C11] | 붉은 할레이션(하이라이트 주변 적색 번짐), 텅스텐 무드 | Cinestill 500T, red halation glow, tungsten night | 유력 (모체 특성 [C11]) | probable |
| Cinestill 800T | 시네스틸 800T | 고감도 텅스텐 밸런스 야간용 필름 | ISO 800, 텅스텐 밸런스 (직접 스펙 근거 없음) [C11-유추] | 강한 적색 할레이션, 저조도 네온 야경 | Cinestill 800T, red halation, neon night | pending(갭), 직접 근거 없음 | pending-gap |
| Ilford HP5 Plus | 일포드 HP5 플러스 | 중간 대비의 ISO 400 흑백 필름 | ISO 400, EI 3200/36°까지 push, medium contrast [C14] | Tri-X보다 부드러운 중간 대비, 넓은 관용도 | Ilford HP5 Plus, medium-contrast documentary black and white | 확정 [C14], MJ 토큰 [C19] | confirmed |

### 5. 슬롯 E: 커머셜 리터칭 색 관행

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| skin tone density standard | 스킨톤 밀도 기준 | 커머셜 리터칭의 피부톤 노출·색 기준값 | Status M 적색 확산밀도: light 1.08~1.18, dark 0.93~1.03, Gray Card 0.77~0.87 [C10] | 균일하고 자연스러운 피부 노출 | natural even skin tone, retouched complexion | 유력 [C10] | probable |
| brand color matching | 브랜드 컬러 매칭 | 촬영·그레이딩 결과를 지정 브랜드 색값에 일치시키는 관행 | (직접 정량 근거 없음, 캐릭터라이제이션 곡선·CDL 활용 유추) | 특정 hue로 고정된 제품·배경 색 | brand color accurate, matched to reference palette | pending(갭), 직접 근거 없음 | pending-gap |
| AI skin tone bias (caution) | AI 스킨톤 편향 주의 | 생성 모델이 스킨톤·인종을 클리셰로 균질화하는 경향 (프롬프트 설계 주의사항) | SDXL 중동 인물 코사인 유사도 0.61(파인튜닝 후 0.41), 'a person'=White 47%/남성 65% [C21] | 인종별 균질화, 중동남성=수염+갈색피부 수렴 | (주의 항목, 생성 프롬프트에 다양성 명시 필요) | 유력 [C21] | probable |

## Part 4: 구도·프레이밍

샷 사이즈, 카메라 앵글, 애스펙트비, 화면 방향성·안전역 (38개 키워드)

### 1. A. 샷 거리·뷰 방향·화면 구성 · distance / view / composition

피사체와 카메라의 거리, 카메라 높이, 제품이 보여주는 면, 화면 안 배치를 분리해 제어한다.

| Keyword | Canonical ID | Relation | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| close-up |  |  | 클로즈업 | 인물은 얼굴만, 제품은 상세 부분 표현 |  | 세부 디테일 노출, 배경 최소화 | close-up detail shot, tight framing | [C1][C2][C4] 3소스 수렴 | confirmed |
| medium-shot |  |  | 미디엄샷 | 인물은 허리 위, 제품은 전체 형태 + 맥락 |  | 피사체 완전 노출, 배경 부분 포함 | medium shot, subject and context | [C1][C2][C4] 3소스 | confirmed |
| wide-shot |  |  | 와이드샷 | 피사체 전체 + 환경 맥락 노출 |  | 공간감 강조, 환경 조화 | wide shot, environmental context | [C1][C2][C4] 3소수 | confirmed |
| extreme-close-up |  |  | 극근접샷 | 눈썹/눈/입술/제품 미세부분 매크로 |  | 마이크로 텍스처, 개별 입자 가시 | extreme close-up, macro detail | [C5] 매크로 기술서 | probable |
| eye-level |  |  | 아이레벨 | 카메라 높이 = 피사체 눈높이, 자연스러운 관점 |  | 중립 감정, 동등한 시점 | eye-level perspective, neutral view | [C2][C3] 상업 샷리스트 | confirmed |
| high-angle |  |  | 하이앵글 | 카메라 위에서 내려다봄, 피사체 축소 |  | 권력 불균형, 보호받지 않는 느낌 | high-angle shot, looking down | [C2][C3] 심리 효과 | confirmed |
| low-angle |  |  | 로우앵글 | 카메라 아래에서 올려다봄, 피사체 강화 |  | 권력/위엄/위협, 우월 느낌 | low-angle shot, looking up, powerful | [C2][C3] 심리 효과 | confirmed |
| dutch-angle |  |  | 더치앵글 | 수평선 기울어짐, 불안정·긴장 효과 |  | 구도 불안정, 심리적 긴장 | tilted Dutch angle, unease | [C6] Wikipedia Dutch Angle | probable |
| overhead-shot |  |  | 오버헤드샷 | 카메라 직상방, 평면 2D 뷰 |  | 기하학적 패턴, 조감도 | overhead top-down view, bird's eye | [C4] 촬영 기법 | probable |
| rule-of-thirds |  |  | 삼분할 법칙 | 프레임을 3x3 격자로 나누고 교점에 배치 |  | 구도 안정, 시선 흐름 자연 | rule of thirds composition | [C4][C7][C8] 3소스 구도 원칙 | confirmed |
| leading-lines |  |  | 선도선 | 철도/도로/경계선 등이 중심으로 수렴 |  | 시선 유도, 원근감 강화 | leading lines, vanishing point | [C4][C7][C8] 3소스 | confirmed |
| negative-space |  |  | 음의 공간 | 피사체 주변의 빈 공간 의도적 활용 |  | 피사체 고립, 극적 강조 | negative space, isolation | [C4][C7][C8] 3소스 | confirmed |
| layering |  |  | 레이어링 | 전/중/후 공간층 다층 배치 |  | 공간 깊이, 3D 감각 | layered composition, depth | [C4][C9] 심도 구성 | confirmed |
| aspect-ratio-169 |  |  | 16:9 화면비 | 수평 2배 와이드, 현대 영상 표준 |  | 영상/TV 표준 좌우 확장 | 16:9 widescreen format | [C11][C12] 표준 정의 | confirmed |
| aspect-ratio-239 |  |  | 2.39:1 시네마스코프 | 극와이드 영화 표준, 아나모픽 → 디스퀴즈 |  | 시네마틱 세로 압축감, 극장 경험 | 2.39:1 anamorphic widescreen, cinematic | [C11][C12] 영화 표준 | confirmed |
| aspect-ratio-square |  |  | 1:1 정사각형 | 소셜 미디어 기본, 균형잡힌 구도 |  | 대칭, 안정, 소셜 최적화 | 1:1 square Instagram format | [C11] 디지털 표준 | probable |
| aspect-ratio-vertical |  |  | 9:16 세로형 | 모바일 세로 자연스러움, 스토리 표준 |  | 세로 강조, 모바일 인-피드 | 9:16 vertical Stories format | [C11] 모바일 표준 | probable |
| 180-degree-rule |  |  | 180도 규칙 | 카메라가 상상의 선 한쪽만 사용, 연속성 유지 |  | 공간 방향성 보존, 혼란 회피 | 180-degree rule, screen direction | [C9][C10] 영화 문법 | confirmed |
| crossing-the-line |  |  | 선 넘기 | 180도 규칙 위반 시 의도적 효과 |  | 불안, 혼란, 또는 인식 전환 | breaking 180-degree rule, disorientation | [C9][C10] 영화 기법 | confirmed |
| safety-zone |  |  | 안전역 | TV 자막·로고 배치 보호 영역 |  | 텍스트/UI 배치 보호 | safe title area, safe action zone | [C13] TV 기술 | probable |
| screen-direction-left-to-right |  |  | 화면 방향성: 좌→우 | 진행 방향 일관성, 화면 연속성 |  | 시선 흐름, 내러티브 진행 | left-to-right screen direction | [C9][C10] | confirmed |
| perspective-compression | cp.perspective-compression | cross-reference | 원근 압축 | 망원렌즈가 z축 깊이 압축, 층 겹침 |  | 배경·전경 밀착, 평면화 | telephoto compression, stacked depth | [C3][C5] 렌즈 물리 | confirmed |
| perspective-exaggeration | cp.perspective-exaggeration | cross-reference | 원근 과장 | 광각이 z축 확장, 거리감 극대 |  | 전경 돌출, 배경 후퇴 | wide-angle exaggeration, expansive space | [C3][C5] 렌즈 물리 | confirmed |
| rack-focus | cp.rack-focus | cross-reference | 랙 포커스 | 초점 이동으로 시선 유도 (영상)/선택 초점 (스틸) |  | 선택적 초점, 시선 제어 | selective focus, rack focus | [C14] 영상 기법 | probable |
| frame-within-frame |  |  | 액자 구도 | 자연·건축물이 피사체를 둘러 프레임 형성 |  | 피사체 격리, 극적 강조 | frame within frame, nested composition | [C4][C7][C8] 3소스 | confirmed |
| front-view |  |  | 정면 뷰 | 카메라를 제품 전면에 수직으로 맞춰 대표 면과 좌우 대칭을 직접 보여주는 뷰 | 카메라 광축을 제품 전면의 주 평면에 수직으로 정렬 | 전면 기능과 그래픽이 왜곡 없이 읽히고 좌우 폭이 명확함 | straight-on front view, camera square to the product face | 유력 [C15][C16] · 상업 제품 샷리스트의 정면 각도 관행, 생성 직접 제어 반복 검증 전 | probable |
| three-quarter-view |  |  | 3/4 뷰 | 제품의 전면과 한쪽 측면을 동시에 보여 형태와 깊이를 한 컷에서 설명하는 뷰 | 전면과 한쪽 측면이 함께 판독되는 비스듬한 카메라 위치 | 대표 면, 측면 깊이, 모서리 연결이 동시에 읽힘 | three-quarter product view, front and one side visible | 유력 [C15][C16] · 다각도 제품 촬영 관행, 생성 직접 제어 반복 검증 전 | probable |
| side-profile-view |  |  | 측면 프로필 뷰 | 카메라를 제품 측면에 수직으로 맞춰 두께와 옆면 구조를 분리해 보여주는 뷰 | 카메라 광축을 제품 측면의 주 평면에 수직으로 정렬 | 제품 깊이, 가장자리 형상, 측면 조작부가 겹침 없이 읽힘 | strict side-profile view, product depth and edge construction visible | 유력 [C15][C16] · 다각도 제품 촬영 관행, 생성 직접 제어 반복 검증 전 | probable |
| rear-view |  |  | 후면 뷰 | 카메라를 제품 후면에 수직으로 맞춰 뒷면의 구조와 연결부를 직접 보여주는 뷰 | 카메라 광축을 제품 후면의 주 평면에 수직으로 정렬 | 후면 패널, 포트, 체결부와 뒷면 실루엣이 분명함 | straight-on rear view, back construction clearly visible | 유력 [C15][C16] · 다각도 제품 촬영 관행, 생성 직접 제어 반복 검증 전 | probable |
| copy-safe-left |  |  | 왼쪽 카피 안전 구도 | 제품을 오른쪽으로 옮겨 왼쪽에 제목과 CTA를 놓을 수 있는 깨끗한 여백을 확보하는 구도 | 왼쪽 카피 영역과 제품 실루엣, 주요 그림자, 소품의 중첩을 피함 | 오른쪽 제품 중심, 왼쪽에 대비와 질감이 절제된 연속 여백 | product placed away from the left copy area, clean negative space on the left | 유력 [C18] · 웹 히어로 카피 오버레이 관행, 생성 직접 제어 반복 검증 전 | probable |
| copy-safe-right |  |  | 오른쪽 카피 안전 구도 | 제품을 왼쪽으로 옮겨 오른쪽에 제목과 CTA를 놓을 수 있는 깨끗한 여백을 확보하는 구도 | 오른쪽 카피 영역과 제품 실루엣, 주요 그림자, 소품의 중첩을 피함 | 왼쪽 제품 중심, 오른쪽에 대비와 질감이 절제된 연속 여백 | product placed away from the right copy area, clean negative space on the right | 유력 [C18] · 웹 히어로 카피 오버레이 관행, 생성 직접 제어 반복 검증 전 | probable |

### 2. B. 웹 에디토리얼 샷 역할 · web editorial shot roles

카메라 각도 하나가 아니라 웹 UI에서 이미지가 맡는 정보 역할을 기준으로 여러 구도 원자를 조합한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| hero-copy-safe-shot | 카피 안전 히어로 샷 | 첫 화면에서 제품을 즉시 인식시키면서 제목과 CTA가 겹치지 않을 연속 여백을 남기는 대표 컷 | Bundle keys: P4:three-quarter-view · P4:copy-safe-left · P4:wide-shot · P4:safety-zone | 제품은 한쪽에 명확히 고정되고 반대쪽은 낮은 정보 밀도의 카피 영역으로 유지됨 | a web hero product photograph in three-quarter view, product anchored on the right, broad low-detail negative space on the left for headline and CTA, no object or strong shadow crossing the copy area | semantic-bundle |  | web hero with copy overlay | P4:three-quarter-view<br>P4:copy-safe-left<br>P4:wide-shot<br>P4:safety-zone | L1:camera-angle-internal-consistency<br>L1:ground-plane-shadow-mapping<br>L1:size-depth-consistency | 유력 [C16][C18] · 산업 샷리스트와 히어로 카피 배치 관행의 조합, 번들 직접 검증 전 | probable |
| pdp-primary-shot | PDP 기본 제품 샷 | 제품 상세 페이지의 첫 이미지에서 전면 정보와 전체 실루엣을 중립적으로 전달하는 기본 컷 | Bundle keys: P4:front-view · P4:medium-shot · P4:eye-level · P4:safety-zone | 전체 제품이 잘리지 않고 대표 면과 외곽선이 배경에서 또렷하게 분리됨 | a primary product detail page photograph, straight-on front view at eye level, the complete product centered with consistent margin and an unobstructed silhouette | semantic-bundle |  | PDP primary gallery image | P4:front-view<br>P4:medium-shot<br>P4:eye-level<br>P4:safety-zone | L1:camera-angle-internal-consistency<br>L1:size-depth-consistency<br>L1:ground-plane-shadow-mapping | 유력 [C15][C17] · PDP 갤러리와 다각도 제품 촬영 관행의 조합, 번들 직접 검증 전 | probable |
| feature-explainer-shot | 기능 설명 샷 | 제품 전체 형태와 특정 기능 부위의 위치 관계를 한 화면에서 설명하는 상세 섹션용 컷 | Bundle keys: P4:three-quarter-view · P4:medium-shot · P4:rule-of-thirds | 제품의 기준 형태를 유지하면서 설명할 기능 부위가 프레임의 시선 우선점에 놓임 | a feature explainer product photograph in three-quarter view, complete product form retained, the featured control or mechanism clearly visible at a rule-of-thirds focal point, clean adjacent room for a short annotation | semantic-bundle |  | feature explanation section | P4:three-quarter-view<br>P4:medium-shot<br>P4:rule-of-thirds | L1:camera-angle-internal-consistency<br>L1:size-depth-consistency<br>L1:occlusion-shadow-accuracy | 유력 [C16][C17] · 제품 기능 샷과 PDP 이미지 역할의 조합, 번들 직접 검증 전 | probable |
| detail-proof-shot | 디테일 증거 샷 | 재질, 마감, 결합부처럼 구매 판단에 필요한 품질 근거를 근접 프레이밍으로 제시하는 컷 | Bundle keys: P4:close-up · P4:side-profile-view · P4:eye-level | 한 가지 재질 또는 구조 증거가 프레임 대부분을 차지하고 미세 표면과 경계가 판독됨 | a close-up proof photograph of one product material or construction detail, strict side-profile alignment where relevant, crisp surface texture and edge junctions, no decorative prop obscuring the evidence | semantic-bundle |  | material and construction proof | P4:close-up<br>P4:side-profile-view<br>P4:eye-level | L1:specular-consistency<br>L1:camera-angle-internal-consistency<br>L1:shadow-falloff-continuity | 유력 [C16][C17] · 클로즈업과 상세 갤러리 관행의 조합, 번들 직접 검증 전 | probable |
| collection-grid-shot | 컬렉션 그리드 샷 | 여러 제품 카드가 나란히 놓여도 크기와 정렬 기준을 비교할 수 있도록 촬영 조건을 통일한 목록용 컷 | Bundle keys: P4:front-view · P4:eye-level · P4:safety-zone | 동일 배경, 동일 시점, 동일 여백 기준으로 제품 실루엣과 상대 크기가 안정적으로 반복됨 | a collection grid product photograph, straight-on eye-level view, centered product with repeatable scale, camera height, background, and equal margins for consistent catalog cards | semantic-bundle |  | collection and catalog grid | P4:front-view<br>P4:eye-level<br>P4:safety-zone | L1:size-depth-consistency<br>L1:camera-angle-internal-consistency<br>L1:ground-plane-shadow-mapping | 유력 [C15][C17] · 카탈로그 일관성과 갤러리 비교 요구의 조합, 번들 직접 검증 전 | probable |
| scale-in-context-shot | 맥락 속 스케일 샷 | 손, 가구, 신체 또는 익숙한 주변 물체를 함께 보여 제품의 실제 크기와 사용 위치를 설명하는 컷 | Bundle keys: P4:wide-shot · P4:eye-level · P4:layering | 제품과 신뢰할 수 있는 크기 단서가 같은 공간 평면에서 자연스럽게 비교됨 | a scale-in-context product photograph at a natural eye-level distance, the complete product shown beside a familiar real-world size reference in the same spatial plane, believable use context and proportions | semantic-bundle |  | product scale and use context | P4:wide-shot<br>P4:eye-level<br>P4:layering | L1:size-depth-consistency<br>L1:occlusion-shadow-accuracy<br>L1:ground-plane-shadow-mapping | 유력 [C17] · PDP의 인스케일 이미지 요구를 구도 원자로 번역, 번들 직접 검증 전 | probable |
| product-angle-sequence | 제품 다각도 시퀀스 | 정면, 3/4, 측면, 후면을 같은 높이와 크기로 이어 제품 형태를 빠짐없이 설명하는 갤러리 묶음 | Bundle keys: P4:front-view · P4:three-quarter-view · P4:side-profile-view · P4:rear-view · P4:safety-zone | 네 방향에서 제품 중심, 프레임 점유율, 지평선과 조명이 고정된 연속 이미지 | a four-image product angle sequence with matched scale, camera height, lighting, background, and margins: straight-on front view, three-quarter view, strict side-profile view, and straight-on rear view | semantic-bundle |  | PDP multi-angle gallery sequence | P4:front-view<br>P4:three-quarter-view<br>P4:side-profile-view<br>P4:rear-view<br>P4:safety-zone | L1:camera-angle-internal-consistency<br>L1:size-depth-consistency<br>L1:single-light-source-consistency | 유력 [C15][C16][C17] · 다각도 촬영과 PDP 갤러리 요구의 조합, 번들 직접 검증 전 | probable |

## Part 5: 피사체·재질

표면 질감 vs 형태·윤곽 분리, 금속·유리·액체·극단 재질·인물 (25개 키워드)

### 1. Surface Texture · 표면 질감

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| glossy | 광택 | 높은 직반사, 매끄러운 표면 | 밝은 스펙큘러 하이라이트, 선명한 반사 | glossy reflective surface, specular highlights | [C2][C3][C4] 3소스 | confirmed |
| matte | 무광 | 산란 반사, 빛 흡수 | 부드러운 무광 끝, 하이라이트 없음 | matte diffuse finish, no reflections | [C2][C3][C4] 3소스 | confirmed |
| satin | 새틴 | 중간 반사, 미세 질감 | 부드러운 산란 + 약한 스펙큘러 | satin semi-gloss, soft texture | [C2][C3] 2소스 | confirmed |

### 2. Material-Specific Lighting · 재질별 조명

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| metal-raking | 금속 래킹 라이트 | 5-20° 저각 옆광으로 스크래치·표면 패턴 극적화 | 스크래치·반사 세로줄, 극단 명암 | metal raking light, micro-scratches visible | [C5][C8] 2소스 | confirmed |
| glass-backlighting | 유리 백라이팅 | 후광 30-50% 키라이트 상향, 투명성·굴절 극적화 | 밝은 투명, 굴절 무지개, 경계 발광 | glass backlighting, refraction glow | [C7][C9] 2소스 | confirmed |
| skin-subsurface-scattering | 인물 SSS | 피부처럼 반투명한 재질에서 빛이 표면 아래로 이동한 뒤 다른 지점으로 나오는 산란 | 귀·코·손가락 투명한 따뜻한 빛 | skin subsurface scattering, translucent ears | 유력 [C10], 고정 산란 비율 근거 제거 | probable |
| fabric-layered-3point | 직물 3점 조명 | 45° 키 + 대칭 측광(45°) + 20~30% 백라이트, 직조 극적화 | 직조 패턴 입체, 섬유 방향 가시 | fabric 3-point layered lighting, weave texture | [C5][C22] 2소수 | confirmed |

### 3. Reflection Management · 반사 관리

| Keyword | Canonical ID | Relation | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| specular-control |  |  | 스펙큘러 제어 | 반사각 = 입사각, 방향성 제어로 반사 위치 지정 | 반사 배치 정밀도, 예측 가능한 하이라이트 | controlled specular angle, directed highlights | [C6][C7] 2소스 | confirmed |
| diffuse-softening |  |  | 확산 연화 | 디퓨저·화이트박스로 직반사를 산란광으로 변환 | 부드러운 무음영 하이라이트, 무대처럼 부드러움 | diffuse soft-box, shadow-free highlights | [C6][C7][C8] 3소수 | confirmed |
| polarization-filter | cp.polarizer | cross-reference | 편광 필터 | 편광 방향을 조절해 비금속 표면의 특정 반사를 줄이는 촬영 기법 | 유리와 물 표면의 눈부심 감소, 내부 색과 질감 가시성 증가 | reduced glare on nonmetal surfaces, clearer color beneath reflections | 유력 [C9], 보편 제거율 근거 제거 | probable |

### 4. Translucency & Refraction · 반투명·굴절

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| glass-wavelength | 유리 파장 분산 | 파장별 굴절률 차이로 색수차 유도 (무지개) | 굴절 색분산, 프리즘 무지개 | glass prism refraction, rainbow dispersion | [C11] 물리학 | probable |
| liquid-surface-tension | 액체 표면장력 | 수면 곡률, 반사각 변화로 동적 반사 | 파문 반사, 수면 곡률 | liquid surface tension, ripple reflections | [C12] 액체 물리 | probable |
| caustics-projection | 광학 반사 패턴 | 수심·곡면 굴절이 바닥에 투영하는 '파형 그림자' | 파형 음영 패턴, 수중 광학 | caustic light patterns, refraction shadows | [C12][C23] 2소수 | confirmed |

### 5. Extreme Cases · 극단 재질

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| black-on-black | 검은색 위의 검은색 | 극저명도 차이 제어, 톤 분리 (>5 스톱 조명비) | 검은 실루엣 내 미묘한 형태, 0~20% 톤 | black-on-black extreme contrast control | [C13] 극단 촬영 | probable |
| white-on-white | 흰색 위의 흰색 | 극고명도 유지, 노출 클리핑 회피, 톤 분리 | 흰색 실루엣 내 극미세 톤, 99~100% | white-on-white high key preservation | [C13] 극단 촬영 | probable |
| mirror-surface | 거울 표면 | 완벽 반사, 카메라·조명·촬영 환경 전부 노출 | 배경 완벽 반사, 카메라 영상 역사진 | mirror surface, perfect reflection | [C14] 특수 촬영 | probable |

### 6. Skin Rendering · 피부 렌더링

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| pore-detail-macro | 모공 디테일 매크로 | 근접 촬영에서 피부의 모공, 미세 주름, 피부톤 차이가 자연스럽게 드러나는 표현 | 개별 모공, 미세 질감, 자연스러운 불완전성 | close-up skin texture, individual pores and fine lines | pending(갭), 보편 PPM 임계값 근거 제거 | pending-gap |
| waxy-skin-avoidance | 왁스 피부 회피 | 균일한 광택과 과도한 표면 평활화로 피부가 왁스처럼 보이는 현상을 회피 | 자연스러운 표피, 표면+내부 혼합 반사 | avoid waxy plastic skin, natural translucence | 유력 [C11][C16], 고정 반사 비율 근거 제거 | probable |

### 7. Food Styling · 푸드 스타일링

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| steam-effect-window | 스팀 효과 윈도우 | 촬영 후 90초 내 촬영, 그 후 응결·소실 | 상승하는 김, 음식 따뜻함 표현 | steam effect, 90-second capture window | [C17][C18] 2소수 | confirmed |
| raking-light-crumb | 래킹 라이트 빵가루 | 90° 카메라 기준 옆각 라이트로 갈라진 질감 극적화 | 질감 세로줄, 신선도 암시 | raking light for crumb texture | [C17][C18] 2소수 | confirmed |

### 8. Jewelry & Metal · 주얼리·금속

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| facet-capture | 면(facet) 포착 | 보석 각 면을 개별 조명 각도로 하이라이트 | 각 면 반짝임, 다면체 깊이 | facet-specific lighting, multi-angle sparkle | [C19][C20] 2소수 | confirmed |
| micro-scratches-raking | 미세 스크래치 래킹 | 5-20° 저각 옆광, 금속 시간 경과 표시 | 스크래치 세로줄, 사용 흔적 | micro-scratches, aged patina | [C8][C20] 2소수 | confirmed |

### 9. AI Failure Patterns · AI 실패 패턴

| Keyword | Canonical ID | Relation | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| plastic-skin-detection |  |  | 플라스틱 피부 탐지 | 균일한 광택, 과도한 평활화, 반복적인 모공 패턴이 함께 나타나는 합성적 피부 신호 | 균일한 광택, 비자연 완벽함 | avoid plastic AI skin, unnatural gloss | 유력 [C11][C16], 고정 판별 수치 근거 제거 | probable |
| impossible-shadow-direction | cp.impossible-shadow-direction | canonical | 불가능한 그림자 방향성 | 그림자가 광원과 반대 방향, 물리 법칙 위반 | 그림자 방향 불일관, 다중 모순 광원 | correct shadow direction, consistent lighting | [C21] 포렌식 검증 | probable |
| reflection-direction-violation |  |  | 반사 방향성 위반 | 반사가 입사각 법칙 무시, 불가능한 위치 반사 | 반사각 불일관, 불가능한 하이라이트 | correct reflection angle, physical law | [C21] 물리 검증 | probable |

## Part 6: 스타일·무드·레지스터

High-key/Low-key, chiaroscuro 계보, named look, 누아르류 무드 어휘 (25개 키워드)

### 1. Named Looks · 인물명·계보 룩

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| hurrell-style | 허렐 스타일 | 1940s 할리우드 초상 룩: 극세밀 조명 + 스포트라이트 직반사 + 강한 대비 + 네거티브 리터칭 | 매끈한 피부, 극명한 스포트라이트, 강렬한 눈빛 | Hurrell-style studio glamour, perfect skin, spotlight | [C1][C2][C8] 3소스 | confirmed |
| rembrandt-lighting | 렘브란트 라이팅 | 17세기 회화 인물 조명 기법: 코 아래 삼각형 명부, 1.5~2 f-stop 조명비, 반측광 | 코 아래 밝은 삼각형, 한쪽은 어두움 | Rembrandt lighting, triangular highlight under nose | [C2][C4] 2소수 | confirmed |
| butterfly-lighting | 나비 조명 | 정면 스튜디오 조명: 코 위 대칭 그림자, 양측 페이스라이트 등거리, 부드러운 바운스 | 코 중심 대칭 그림자, 매끈함 | Butterfly lighting, symmetrical shadow under nose | [C2][C9] 2소수 | confirmed |
| loop-lighting | 루프 조명 | Rembrandt 변형: 삼각형 명부가 눈 아래로 내려옴, 45~60° 수평각도 | Rembrandt보다 약한 그림자 | Loop lighting, softer shadow loop on face | [C2][C9] 2소수 | confirmed |
| split-lighting | 스플릿 조명 | 측광 극단: 피사체 한쪽은 완전 밝음, 다른 쪽은 검음 | 얼굴 정중앙이 경계선, 극단 명암 | Split lighting, face half light half shadow | [C2][C9] 2소수 | confirmed |
| paramount-lighting | 파라마운트 조명 | 1930s 영화사 스튜디오 표준: 높은 키 + 눈 위 삼중 하이라이트(specularity 극적) | 양눈 윤기, 완벽한 피부 | Paramount lighting, classic Hollywood glamour | [C1][C2] 2소수 | confirmed |
| film-noir-shadow-play | 필름 누아르 그림자놀이 | low-key + 불균형 구도 + 강한 rimlight + 실루엣. 시각·경제 동기 혼합 | 극적 그림자, 부분 역광, 비극적 톤 | Film noir shadow play, dramatic low-key contrast | [C6][C10] 2소수 | confirmed |
| commercial-beauty-standard | 커머셜 뷰티 스탠다드 | 스타일링 중심 룩: 극세밀 메이크업 + 4~5점 조명 + 최대 보정 | 완벽한 피부, 극명한 아이라이너, 무흠 마무리 | Commercial beauty standard, flawless skin makeup | [C1][C13] 2소수 | confirmed |

### 2. Grading Looks · 그레이딩 룩

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| teal-and-orange-grade | 틸 앤드 오렌지 그레이드 | 보색 분리: 섀도→청록(120~150°), 스킨→주황·금(0~30°) | 따뜻한 얼굴 대 차가운 배경 | Teal and orange color grade, complementary split | [C3][C5] 2소수 | confirmed |
| bleach-bypass-look | 표백 우회 룩 | 은 잔류: 채도↓, 대비↑, 그레인↑, 블랙 심화 | 뮤트 색 + 검은 블랙, 피부 탈채도 | Bleach bypass silver retention, crushed blacks | [C3][C11] 2소수 | confirmed |
| day-for-night-grade | 데이 포 나이트 그레이드 | 주간 촬영 야간 렌더: 2~3 f-stop 언더, 3200K 텅스텐 필름 청색 캐스트, Purkinje 효과 | 어두운 청색, 달빛 무드 | Day-for-night grade, moonlight blue underexposed | [C3][C12] 2소수 | confirmed |
| high-key-commercial | 하이키 커머셜 | 극밝음 + 최소 섀도 + 고채도 제품 색 | 거의 무영, 밝은 배경 | High-key commercial, minimal shadow clean bright | [C3][C13] 2소수 | confirmed |
| low-key-dramatic | 로우키 드라마틱 | 극어두움 + 강한 대비 + 깊은 섀도 + 선택적 하이라이트 | 드라마틱 조명, 깊은 그림자 | Low-key dramatic, high contrast deep shadows | [C3][C10] 2소수 | confirmed |
| cross-platform-standard | 크로스 플랫폼 표준 그레이드 | 프린트·웹·모바일 각 색공간 검증된 중립 그레이드 | 모든 매체에서 일관된 톤 | Cross-platform standard, universal color space | [C3][C21] 2소수 | confirmed |

### 3. Cinematic Tone · 시네마틱 톤

| Keyword | Canonical ID | Relation | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| golden-hour-tone |  |  | 골든아워 톤 | 일출·일몰 저각 태양(3000~4000K) + 따뜻한 필터 + 길게 늘어진 그림자 | 황금빛 림라이트, 길쭉한 그림자 | Golden hour lighting, warm low-angle sun | [C12][C14] 2소수 | confirmed |
| blue-hour-tone |  |  | 블루아워 톤 | 일몰 후 잔광(10,000K+) + 인공광 대비 + 깊은 청색 하늘 | 짙은 청색 하늘, 따뜻한 인공광 | Blue hour twilight, deep blue ambient sky | [C12][C14] 2소수 | confirmed |
| cinematic-haze | cp.cinematic-haze | cross-reference | 시네마틱 헤이즈 | 대기감·플레어·입자로 채도↓ 대비↓, 시간감 강조 | 뿌연 안개감, 빛 번짐, 부드러운 톤 | Cinematic haze, atmospheric glow diffusion | [C3][C15] 2소수 | confirmed |
| desaturated-muted |  |  | 탈채도·뮤트 톤 | 전체 채도 낮춤 + 절제된 색조, bleach bypass의 색 측면 | 흐릿하고 회색빛 도는 색감 | Desaturated muted palette, low saturation refined | [C3][C11] 2소수 | confirmed |
| split-toning | cp.split-toning | cross-reference | 스플릿 토닝 | 하이라이트와 섀도에 서로 다른 색조: 웜 하이라이트·쿨 섀도 조합 | 부분 색 분리, 대조 톤 | Split toning, warm highlights cool shadows | [C3][C16] 2소수 | confirmed |
| high-contrast-noir-modern |  |  | 고대비 누아르 모던 | 필름 누아르 + 현대 선명도: 극단 명암 + 날카로운 아크릴 질감 | 강한 검은색, 명확한 경계 | High-contrast noir modern, crisp black shadows | [C6][C10] 2소수 | confirmed |

### 4. Painting Techniques · 회화 기법 계보

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| chiaroscuro-Renaissance | 키아로스쿠로: 르네상스 | 빛과 어둠의 극적 대비, 명암비 1:3 이상, 회화 구성 표현 | 극단 밝음·어둠, 극적 형태 분리 | Chiaroscuro Renaissance lighting, dramatic contrast | [C4][C17] 2소수 | confirmed |
| impressionist-diffuse | 인상파 확산 톤 | 렌즈 앞 디퓨저·플레어로 극부드러운 초점 + 뭉개진 색 | 극도로 부드러운 이미지, 색상 번짐 | Impressionist diffuse, soft-focus painterly | [C4][C18] 2소수 | confirmed |
| baroque-drama | 바로크 드라마 | 명암 극단 + 동적 대각선 구도 + 풍부한 재질감(금박·직물·피부) | 화려한 명암, 질감 강조, 극적 포즈 | Baroque drama, rich textures dramatic lighting | [C4][C19] 2소수 | confirmed |
| hyperrealism-precision | 하이퍼리얼리즘: 정밀 사실주의 | 사진보다 선명한 디테일 + 극도의 마감도, 초현실적 명확성 | 매우 세밀한 질감, 완벽한 선명도 | Hyperrealism precision, ultra-detailed photorealistic | [C4][C20] 2소수 | confirmed |
| documentary-naturalism | 다큐멘터리 자연주의 | 최소 개입 톤: 자연광 + 약한 보정 + 사실적 피부 | 자연스러운 불완전성, 약한 재질감 | Documentary naturalism, minimal intervention natural | [C4][C22] 2소수 | confirmed |

## Part 7: 상업 장르·촬영 시나리오

상업 분야와 에셋 용도에서 출발해 P1~P5·P8의 확정 원자 키로 펼쳐지는 촬영 시나리오 번들 (40개 키워드)

### 1. Product, Tech & Home · 제품·테크·홈

제품의 판매, 기능 이해, 생활 맥락을 서로 다른 상업 목적으로 분리한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| product-launch-hero | 제품 출시 히어로 | 신제품의 형태와 핵심 재질을 즉시 읽히게 하고 카피 공간까지 확보하는 출시 대표 컷 | Bundle keys: P1:normal 50mm · P2:soft light · P4:negative-space · P5:specular-control · P8:product-cleanup-defect-removal | 단일 제품 우선, 명확한 실루엣, 통제된 반사, 카피 여백 | a launch hero photograph that makes the product silhouette and primary material immediately legible | semantic-bundle | product-tech-home | launch hero | P1:normal 50mm<br>P2:soft light<br>P4:negative-space<br>P5:specular-control<br>P8:product-cleanup-defect-removal | L1:ground-plane-shadow-mapping<br>L1:reflection-angle-law<br>L1:specular-reflection-position | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| repairable-tech-demonstration | 수리 가능 테크 데모 | 모듈, 체결부, 교체 가능한 부품과 사용 동작을 한 화면에서 설명하는 기능 중심 컷 | Bundle keys: P1:wide-normal 35mm · P2:soft light · P4:layering · P5:metal-raking · P8:eco-conscious-sustainable | 본체와 분리 부품의 질서, 손의 동작, 구조와 재질의 판독성 | a repairable technology demonstration with the main device, serviceable modules, and one clear hand action | semantic-bundle | product-tech-home | feature demonstration | P1:wide-normal 35mm<br>P2:soft light<br>P4:layering<br>P5:metal-raking<br>P8:eco-conscious-sustainable | L1:size-depth-consistency<br>L1:occlusion-shadow-accuracy<br>L1:camera-angle-internal-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| home-object-contextual-editorial | 홈 오브젝트 맥락 에디토리얼 | 생활 공간 속에서 제품의 크기, 사용 위치, 주변 물성과의 관계를 보여주는 에디토리얼 컷 | Bundle keys: P1:wide-normal 35mm · P2:overcast · P4:rule-of-thirds · P5:matte · P8:custom-set-vs-location-tradeoff | 제품 중심의 실제 공간, 절제된 생활 흔적, 자연스러운 스케일 단서 | a contextual home-object editorial showing believable scale, placement, and restrained signs of use | semantic-bundle | product-tech-home | contextual editorial | P1:wide-normal 35mm<br>P2:overcast<br>P4:rule-of-thirds<br>P5:matte<br>P8:custom-set-vs-location-tradeoff | L1:size-depth-consistency<br>L1:shadow-falloff-continuity<br>L1:vanishing-point-alignment | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

### 2. Fashion, Apparel & Footwear · 패션·의류·풋웨어

판매용 핏, 캠페인 움직임, 제작 디테일을 서로 다른 촬영 목적으로 구분한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ecommerce-fit-lookbook | 이커머스 핏 룩북 | 의복의 길이, 핏, 실루엣과 착용 관계를 왜곡 없이 비교할 수 있는 판매용 룩북 | Bundle keys: P1:short-tele 85mm · P2:soft light · P4:wide-shot · P5:fabric-layered-3point · P8:wardrobe-coordination-fit | 중립 자세, 전체 핏 판독, 단순한 배경, 일관된 시점 | an ecommerce fit lookbook with neutral performance and fully legible garment silhouette | semantic-bundle | fashion-apparel-footwear | ecommerce fit | P1:short-tele 85mm<br>P2:soft light<br>P4:wide-shot<br>P5:fabric-layered-3point<br>P8:wardrobe-coordination-fit | L1:camera-angle-internal-consistency<br>L1:ground-plane-shadow-mapping<br>L1:size-depth-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| movement-fashion-editorial | 움직임 패션 에디토리얼 | 보행과 회전으로 원단의 드레이프와 의복의 방향성을 보여주는 캠페인 컷 | Bundle keys: P1:wide-normal 35mm · P2:hard light · P4:screen-direction-left-to-right · P5:fabric-layered-3point · P8:wardrobe-coordination-fit | 한 번의 명확한 동작, 분리되는 실루엣, 살아 있는 원단 주름 | a fashion campaign editorial built around one clear movement and readable fabric drape | semantic-bundle | fashion-apparel-footwear | campaign editorial | P1:wide-normal 35mm<br>P2:hard light<br>P4:screen-direction-left-to-right<br>P5:fabric-layered-3point<br>P8:wardrobe-coordination-fit | L1:ground-plane-shadow-mapping<br>L1:multiple-object-shadow-logic<br>L1:camera-angle-internal-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| apparel-construction-detail | 의류 구조 디테일 | 봉제, 접합, 보강, 수선 흔적과 원단 층을 상품 정보로 보여주는 디테일 컷 | Bundle keys: P1:short-tele 85mm · P2:hard light · P4:close-up · P5:fabric-layered-3point · P8:eco-conscious-sustainable | 실밥과 이음선의 판독성, 재질 층, 손 또는 도구의 제한적 등장 | an apparel construction detail showing stitching, layered fabric, and repair or reinforcement evidence | semantic-bundle | fashion-apparel-footwear | construction detail | P1:short-tele 85mm<br>P2:hard light<br>P4:close-up<br>P5:fabric-layered-3point<br>P8:eco-conscious-sustainable | L1:occlusion-shadow-accuracy<br>L1:shadow-falloff-continuity<br>L1:specular-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

### 3. Food, Beverage & Hospitality · 푸드·음료·호스피탈리티

메뉴의 식감, 음료 서비스, 현장 접객 순간을 분리해 상업 목적을 명확히 한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| menu-texture-hero | 메뉴 식감 히어로 | 대표 메뉴의 표면, 단면, 수분과 온도 단서를 구매 욕구와 연결하는 메뉴 히어로 | Bundle keys: P1:normal 50mm · P2:soft light · P4:close-up · P5:raking-light-crumb · P8:basic-corrections-exposure-color | 주요 음식 우선, 먹을 수 있는 질감, 절제된 김과 수분, 선명한 단면 | a menu texture hero centered on edible surface detail, freshness, and believable heat or moisture | semantic-bundle | food-beverage-hospitality | menu hero | P1:normal 50mm<br>P2:soft light<br>P4:close-up<br>P5:raking-light-crumb<br>P8:basic-corrections-exposure-color | L1:shadow-falloff-continuity<br>L1:ground-plane-shadow-mapping<br>L1:specular-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| beverage-ritual-editorial | 음료 리추얼 에디토리얼 | 따르기, 거품 올리기, 가니시 배치 같은 한 번의 서비스 동작으로 음료 경험을 전달하는 컷 | Bundle keys: P1:short-tele 85mm · P2:hard light · P4:rule-of-thirds · P5:glass-backlighting · P8:set-composition-brand-integration | 잔과 손의 관계, 액체의 투명도, 한 가지 서비스 제스처, 절제된 바 배경 | a beverage ritual editorial with one precise serving gesture and believable liquid, glass, and garnish behavior | semantic-bundle | food-beverage-hospitality | beverage ritual | P1:short-tele 85mm<br>P2:hard light<br>P4:rule-of-thirds<br>P5:glass-backlighting<br>P8:set-composition-brand-integration | L1:glass-refraction-plausibility<br>L1:reflection-angle-law<br>L1:specular-reflection-position | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| tableside-service-moment | 테이블사이드 서비스 순간 | 직원, 접시, 손님 자리의 관계를 통해 호스피탈리티의 숙련도와 공간 경험을 보여주는 장면 | Bundle keys: P1:wide-normal 35mm · P2:soft light · P4:layering · P5:satin · P8:custom-set-vs-location-tradeoff | 서비스 손동작, 접시 중심, 손님 자리와 공간의 깊이, 과도하지 않은 연출 | a tableside hospitality service moment with one skilled action, a legible dish, and believable guest context | semantic-bundle | food-beverage-hospitality | hospitality service | P1:wide-normal 35mm<br>P2:soft light<br>P4:layering<br>P5:satin<br>P8:custom-set-vs-location-tradeoff | L1:occlusion-shadow-accuracy<br>L1:size-depth-consistency<br>L1:multiple-object-shadow-logic | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

### 4. Beauty, Skin & Hair · 뷰티·스킨·헤어

사용 리추얼, 색상 카탈로그, 피부·두피 증거 디테일을 분리한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| skincare-ritual-editorial | 스킨케어 리추얼 에디토리얼 | 제품과 피부 접촉을 한 번의 명확한 사용 동작으로 보여주면서 실제 피부 질감을 보존하는 컷 | Bundle keys: P1:short-tele 85mm · P2:soft light · P4:close-up · P5:specular-control · P8:invisible-retouching-standard | 손과 얼굴의 자연스러운 접촉, 살아 있는 피부, 제품의 점도와 사용량 단서 | a skincare ritual editorial with one clear application gesture and natural, specific skin texture | semantic-bundle | beauty-skin-hair | skincare ritual | P1:short-tele 85mm<br>P2:soft light<br>P4:close-up<br>P5:specular-control<br>P8:invisible-retouching-standard | L1:specular-consistency<br>L1:shadow-falloff-continuity<br>L1:camera-angle-internal-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| color-swatch-catalog | 컬러 스와치 카탈로그 | 립, 아이, 네일 색상을 동일 조건에서 비교하고 질감 차이까지 판독하는 판매용 스와치 체계 | Bundle keys: P1:normal 50mm · P2:soft light · P4:rule-of-thirds · P5:matte · P8:style-guide-documentation | 동일 크기 스와치, 중립 배경, 색과 광택 차이, 규칙적인 비교 배열 | a calibrated beauty shade catalog with equally presented swatches and legible finish differences | semantic-bundle | beauty-skin-hair | shade catalog | P1:normal 50mm<br>P2:soft light<br>P4:rule-of-thirds<br>P5:matte<br>P8:style-guide-documentation | L1:single-light-source-consistency<br>L1:specular-consistency<br>L1:size-depth-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| hair-scalp-evidence-detail | 헤어·두피 증거 디테일 | 모발 밀도, 가르마, 두피 표면과 제품 사용 부위를 과장 없이 확인하는 증거 중심 컷 | Bundle keys: P1:short-tele 85mm · P2:hard light · P4:close-up · P5:specular-control · P8:source-quality-constraints | 가르마와 모발 뿌리 판독, 제한된 사용 부위, 균일하지 않은 실제 표면 | a hair and scalp evidence detail with legible roots, parting, and realistic surface variation | semantic-bundle | beauty-skin-hair | evidence detail | P1:short-tele 85mm<br>P2:hard light<br>P4:close-up<br>P5:specular-control<br>P8:source-quality-constraints | L1:specular-consistency<br>L1:shadow-falloff-continuity<br>L1:camera-angle-internal-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

### 5. Automotive & Mobility · 자동차·모빌리티

출시 조형, 실제 이동 맥락, 실내 CMF와 인터페이스를 분리한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| studio-vehicle-launch | 스튜디오 차량 출시 | 차체 비례와 표면 연속성을 보존하면서 신차의 대표 조형을 전달하는 출시 컷 | Bundle keys: P1:short-tele 85mm · P2:soft light · P4:low-angle · P5:glossy · P5:specular-control · P8:product-cleanup-defect-removal | 차체 전체 비례, 이어지는 하이라이트, 휠과 유리의 자연스러운 접지 | a studio vehicle launch photograph with preserved body geometry and continuous reflections across paint and glass | semantic-bundle | automotive-mobility | vehicle launch | P1:short-tele 85mm<br>P2:soft light<br>P4:low-angle<br>P5:glossy<br>P5:specular-control<br>P8:product-cleanup-defect-removal | L1:reflection-angle-law<br>L1:specular-reflection-position<br>L1:ground-plane-shadow-mapping | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| road-use-lifestyle | 도로 사용 라이프스타일 | 차량 또는 소형 모빌리티가 실제 이동과 정차 맥락에서 어떤 생활 역할을 하는지 보여주는 컷 | Bundle keys: P1:wide-normal 35mm · P2:overcast · P4:leading-lines · P5:satin · P8:custom-set-vs-location-tradeoff | 이동 경로, 운전자 또는 사용자의 한 동작, 환경과 차량의 스케일 관계 | a mobility lifestyle photograph showing one believable travel or stopover use case in its real environment | semantic-bundle | automotive-mobility | mobility lifestyle | P1:wide-normal 35mm<br>P2:overcast<br>P4:leading-lines<br>P5:satin<br>P8:custom-set-vs-location-tradeoff | L1:size-depth-consistency<br>L1:line-convergence-accuracy<br>L1:multiple-object-shadow-logic | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| cockpit-cmf-detail | 콕핏 CMF 디테일 | 대시보드, 컨트롤, 패널과 재활용 소재의 표면 차이를 기능 정보로 보여주는 실내 디테일 | Bundle keys: P1:normal 50mm · P2:hard light · P4:close-up · P5:metal-raking · P8:eco-conscious-sustainable | 손가락과 컨트롤의 관계, 금속·직물·복합재의 구분, 유리 반사 제어 | an automotive cockpit CMF detail with legible controls and distinct metal, textile, composite, and glass responses | semantic-bundle | automotive-mobility | interior feature | P1:normal 50mm<br>P2:hard light<br>P4:close-up<br>P5:metal-raking<br>P8:eco-conscious-sustainable | L1:reflection-angle-law<br>L1:specular-consistency<br>L1:camera-angle-internal-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

### 6. Architecture, Interior & Retail · 건축·인테리어·리테일

외부 맥락, 공간 경험, 조립 가능한 리테일 시스템을 구분한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| exterior-context-hero | 건축 외부 맥락 히어로 | 건축물의 정면만이 아니라 접근 경로, 주변 스케일, 용도를 함께 보여주는 외부 대표 컷 | Bundle keys: P1:wide-normal 35mm · P2:direct sunlight · P4:leading-lines · P4:wide-shot · P8:custom-set-vs-location-tradeoff | 수렴하는 구조선, 명확한 출입 동선, 주변과 건축의 비례 | an architectural exterior hero showing approach, neighborhood scale, and the building's primary use | semantic-bundle | architecture-interior-retail | exterior context | P1:wide-normal 35mm<br>P2:direct sunlight<br>P4:leading-lines<br>P4:wide-shot<br>P8:custom-set-vs-location-tradeoff | L1:line-convergence-accuracy<br>L1:vanishing-point-alignment<br>L1:size-depth-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| hospitality-interior-story | 호스피탈리티 인테리어 스토리 | 좌석, 서비스 지점, 재료와 이동 흐름을 통해 공간의 실제 경험을 전달하는 인테리어 컷 | Bundle keys: P1:wide-normal 35mm · P2:soft light · P4:layering · P4:frame-within-frame · P8:set-composition-brand-integration | 전경과 후경의 공간층, 서비스 중심점, 사람이 사용 가능한 동선 | a hospitality interior story with layered seating, a clear service point, and believable circulation | semantic-bundle | architecture-interior-retail | interior experience | P1:wide-normal 35mm<br>P2:soft light<br>P4:layering<br>P4:frame-within-frame<br>P8:set-composition-brand-integration | L1:line-convergence-accuracy<br>L1:occlusion-shadow-accuracy<br>L1:multiple-object-shadow-logic | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| retail-system-documentation | 리테일 시스템 기록 | 진열, 모듈, 조립 방식과 재배치 가능성을 한눈에 설명하는 리테일 시스템 기록 컷 | Bundle keys: P1:normal 50mm · P2:overcast · P4:rule-of-thirds · P5:matte · P8:modular-construction-reconfiguration | 반복 모듈, 결합부, 상품과 구조의 분리, 확장 가능한 배열 | a retail system documentation photograph showing modular bays, connections, and reconfiguration logic | semantic-bundle | architecture-interior-retail | retail system feature | P1:normal 50mm<br>P2:overcast<br>P4:rule-of-thirds<br>P5:matte<br>P8:modular-construction-reconfiguration | L1:size-depth-consistency<br>L1:camera-angle-internal-consistency<br>L1:ground-plane-shadow-mapping | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

### 7. Lifestyle, Travel & Workplace · 라이프스타일·여행·워크플레이스

생활 루틴, 이동의 문턱, 협업 장면을 목적별로 구분한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lived-in-home-routine | 생활감 있는 홈 루틴 | 정돈된 쇼룸이 아니라 실제 생활 동작과 제한된 흔적을 통해 제품 또는 서비스를 보여주는 장면 | Bundle keys: P1:wide-normal 35mm · P2:overcast · P4:medium-shot · P4:layering · P8:custom-set-vs-location-tradeoff | 한 사람의 루틴, 사용 중인 물건, 과하지 않은 생활 흔적, 이동 가능한 공간 | a lived-in home routine with one credible action and restrained personal traces rather than showroom styling | semantic-bundle | lifestyle-travel-workplace | home lifestyle | P1:wide-normal 35mm<br>P2:overcast<br>P4:medium-shot<br>P4:layering<br>P8:custom-set-vs-location-tradeoff | L1:size-depth-consistency<br>L1:multiple-object-shadow-logic<br>L1:camera-angle-internal-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| travel-threshold-story | 여행 문턱 스토리 | 역, 로비, 문, 플랫폼처럼 출발과 도착이 교차하는 장소에서 이동의 기대감을 전달하는 컷 | Bundle keys: P1:wide-normal 35mm · P2:soft light · P4:leading-lines · P4:screen-direction-left-to-right · P8:custom-set-vs-location-tradeoff | 여행자와 작은 짐, 진행 방향, 공간의 진입점, 지역성을 보여주는 배경 | a travel threshold story at a station, lobby, doorway, or platform with clear movement and local context | semantic-bundle | lifestyle-travel-workplace | travel editorial | P1:wide-normal 35mm<br>P2:soft light<br>P4:leading-lines<br>P4:screen-direction-left-to-right<br>P8:custom-set-vs-location-tradeoff | L1:line-convergence-accuracy<br>L1:size-depth-consistency<br>L1:ground-plane-shadow-mapping | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| workplace-collaboration-editorial | 워크플레이스 협업 에디토리얼 | 실제 도구와 산출물을 중심으로 두 명 이상이 협업하는 과정을 과장 없이 보여주는 장면 | Bundle keys: P1:normal 50mm · P2:soft light · P4:layering · P5:matte · P8:set-composition-brand-integration | 역할이 다른 참여자, 공유 작업면, 실제 도구, 읽을 수 있는 상호작용 | a workplace collaboration editorial centered on real tools, shared work, and distinct participant roles | semantic-bundle | lifestyle-travel-workplace | workplace editorial | P1:normal 50mm<br>P2:soft light<br>P4:layering<br>P5:matte<br>P8:set-composition-brand-integration | L1:occlusion-shadow-accuracy<br>L1:multiple-object-shadow-logic<br>L1:size-depth-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

### 8. Portrait, Editorial & Culture · 인물·에디토리얼·문화

프로필, 환경 인물, 공연과 문화 현장을 서로 다른 서사 밀도로 구분한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neutral-profile-portrait | 중립 프로필 인물 | 인물의 표정과 얼굴을 과장하지 않고 직업 또는 소개 맥락에 사용할 수 있는 프로필 컷 | Bundle keys: P1:short-tele 85mm · P2:soft light · P4:medium-shot · P5:specular-control · P8:invisible-retouching-standard | 중립 시선, 자연스러운 피부, 단순한 배경 분리, 인물 우선 | a neutral profile portrait with specific natural skin, restrained expression, and simple background separation | semantic-bundle | portrait-editorial-culture | profile portrait | P1:short-tele 85mm<br>P2:soft light<br>P4:medium-shot<br>P5:specular-control<br>P8:invisible-retouching-standard | L1:specular-consistency<br>L1:shadow-falloff-continuity<br>L1:camera-angle-internal-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| environmental-maker-portrait | 환경형 메이커 인물 | 작업자와 도구, 작업 공간을 함께 보여주되 인물의 역할과 숙련도를 중심에 두는 환경 인물 | Bundle keys: P1:wide-normal 35mm · P2:overcast · P4:rule-of-thirds · P4:layering · P8:custom-set-vs-location-tradeoff | 인물과 작업대, 소수의 핵심 도구, 실제 작업 흔적, 공간 깊이 | an environmental maker portrait connecting one person, essential tools, and a credible working space | semantic-bundle | portrait-editorial-culture | environmental portrait | P1:wide-normal 35mm<br>P2:overcast<br>P4:rule-of-thirds<br>P4:layering<br>P8:custom-set-vs-location-tradeoff | L1:size-depth-consistency<br>L1:occlusion-shadow-accuracy<br>L1:multiple-object-shadow-logic | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| culture-performance-editorial | 문화·공연 에디토리얼 | 음악, 출판, 전시, 공연의 실제 행위와 장소성을 한 장의 문화 에디토리얼로 전달하는 컷 | Bundle keys: P1:normal 50mm · P2:hard light · P4:layering · P5:satin · P8:set-composition-brand-integration | 한 가지 핵심 행위, 장소의 실용 조명, 참여자와 도구의 명확한 관계 | a culture and performance editorial built around one real creative action, its tools, and venue context | semantic-bundle | portrait-editorial-culture | culture editorial | P1:normal 50mm<br>P2:hard light<br>P4:layering<br>P5:satin<br>P8:set-composition-brand-integration | L1:single-light-source-consistency<br>L1:ground-plane-shadow-mapping<br>L1:camera-angle-internal-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

### 9. Jewelry, Watch & Luxury Craft · 주얼리·워치·럭셔리 공예

캠페인 히어로, 기계 디테일, 장인의 제작 과정을 구분한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| jewelry-campaign-hero | 주얼리 캠페인 히어로 | 보석의 형상과 광학 반응을 보존하면서 한 가지 착용 또는 테이블톱 맥락을 주는 캠페인 컷 | Bundle keys: P1:short-tele 85mm · P2:hard light · P4:negative-space · P5:facet-capture · P8:accessory-jewelry-coordination | 보석 우선, 제어된 하이라이트, 금속과 스톤의 분리, 절제된 배경 | a jewelry campaign hero with controlled facets, metal reflections, and one restrained wearing or tabletop context | semantic-bundle | jewelry-watch-luxury-craft | jewelry hero | P1:short-tele 85mm<br>P2:hard light<br>P4:negative-space<br>P5:facet-capture<br>P8:accessory-jewelry-coordination | L1:reflection-angle-law<br>L1:specular-reflection-position<br>L1:specular-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| watch-movement-detail | 워치 무브먼트 디테일 | 다이얼, 케이스, 크리스털과 무브먼트의 층을 기능과 공예 정보로 보여주는 워치 디테일 | Bundle keys: P1:short-tele 85mm · P2:hard light · P4:close-up · P5:metal-raking · P8:product-cleanup-defect-removal | 기계층의 깊이, 금속 가공 차이, 크리스털 반사, 읽히는 부품 관계 | a watch movement detail with legible mechanical layers, distinct metal finishes, and controlled crystal reflection | semantic-bundle | jewelry-watch-luxury-craft | mechanism detail | P1:short-tele 85mm<br>P2:hard light<br>P4:close-up<br>P5:metal-raking<br>P8:product-cleanup-defect-removal | L1:reflection-angle-law<br>L1:glass-refraction-plausibility<br>L1:specular-reflection-position | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| luxury-craft-process | 럭셔리 공예 과정 | 완성품만이 아니라 세공, 연마, 조립 과정과 손의 숙련도를 함께 전달하는 브랜드 공예 컷 | Bundle keys: P1:normal 50mm · P2:soft light · P4:layering · P5:micro-scratches-raking · P8:shooting-timeline | 손과 도구의 접촉, 진행 중인 부품, 완성품의 제한적 등장, 실제 작업면 | a luxury craft process showing one precise hand-tool action, an in-progress component, and restrained finished-product context | semantic-bundle | jewelry-watch-luxury-craft | craft process | P1:normal 50mm<br>P2:soft light<br>P4:layering<br>P5:micro-scratches-raking<br>P8:shooting-timeline | L1:occlusion-shadow-accuracy<br>L1:multiple-object-shadow-logic<br>L1:specular-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

### 10. Documentary, Maker & Process · 다큐멘터리·메이커·과정

제작 현장, 수리 과정, 소재의 출처와 변화를 서로 다른 기록 목적으로 구분한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| workshop-process-documentary | 워크숍 과정 다큐멘터리 | 작업 공간, 도구, 작업자와 진행 중인 결과물을 한 공정 중심으로 기록하는 제작 다큐멘터리 | Bundle keys: P1:wide-normal 35mm · P2:overcast · P4:layering · P5:matte · P8:shooting-timeline | 한 공정의 시작과 결과, 손과 도구, 실제 작업 흔적, 현장 조명 | a workshop process documentary centered on one real making step, its tools, and the in-progress result | semantic-bundle | documentary-maker-process | making process | P1:wide-normal 35mm<br>P2:overcast<br>P4:layering<br>P5:matte<br>P8:shooting-timeline | L1:occlusion-shadow-accuracy<br>L1:size-depth-consistency<br>L1:multiple-object-shadow-logic | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| repair-disassembly-story | 수리·분해 스토리 | 분해 순서, 교체 부품, 도구와 손의 관계를 통해 수리 가능성과 제품 수명을 설명하는 컷 | Bundle keys: P1:normal 50mm · P2:soft light · P4:layering · P5:metal-raking · P8:eco-conscious-sustainable | 분리된 부품의 질서, 본체 위치 고정, 한 가지 수리 동작, 부품 스케일 | a repair and disassembly story with ordered components, one service action, and a fixed main product footprint | semantic-bundle | documentary-maker-process | repair story | P1:normal 50mm<br>P2:soft light<br>P4:layering<br>P5:metal-raking<br>P8:eco-conscious-sustainable | L1:size-depth-consistency<br>L1:occlusion-shadow-accuracy<br>L1:camera-angle-internal-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| provenance-material-process | 소재 출처·공정 기록 | 원재료, 중간 가공 상태, 완성 표면을 연결해 소재의 출처와 변화를 보여주는 기록 컷 | Bundle keys: P1:normal 50mm · P2:hard light · P4:rule-of-thirds · P5:micro-scratches-raking · P8:eco-conscious-sustainable | 세 단계 소재 상태, 일관된 스케일, 표면 차이, 공정 순서 | a material provenance process connecting raw material, an intermediate state, and the finished surface | semantic-bundle | documentary-maker-process | material provenance | P1:normal 50mm<br>P2:hard light<br>P4:rule-of-thirds<br>P5:micro-scratches-raking<br>P8:eco-conscious-sustainable | L1:size-depth-consistency<br>L1:specular-consistency<br>L1:single-light-source-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

### 11. Sports & Outdoor · 스포츠·아웃도어

퍼포먼스 동작, 장비의 현장 사용, 짧은 야외 체류 경험을 구분한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| athlete-performance-action | 선수 퍼포먼스 액션 | 한 명의 선수와 한 가지 핵심 동작을 중심으로 자세, 장비, 진행 방향을 읽히게 하는 퍼포먼스 컷 | Bundle keys: P1:telephoto 135mm · P2:direct sunlight · P4:screen-direction-left-to-right · P4:wide-shot · P8:wardrobe-coordination-fit | 명확한 동작 단계, 장비와 신체의 접촉, 진행 방향, 실제 지면 반응 | an athlete performance action centered on one readable movement, equipment contact, and clear travel direction | semantic-bundle | sports-outdoor | performance campaign | P1:telephoto 135mm<br>P2:direct sunlight<br>P4:screen-direction-left-to-right<br>P4:wide-shot<br>P8:wardrobe-coordination-fit | L1:ground-plane-shadow-mapping<br>L1:camera-angle-internal-consistency<br>L1:size-depth-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| outdoor-gear-field-use | 아웃도어 장비 현장 사용 | 의류, 신발, 가방 또는 장비가 날씨와 지형 속에서 실제로 작동하는 방식을 보여주는 현장 컷 | Bundle keys: P1:wide-normal 35mm · P2:overcast · P4:rule-of-thirds · P5:fabric-layered-3point · P8:eco-conscious-sustainable | 장비의 사용 부위, 지형 접촉, 날씨 단서, 기능을 설명하는 한 동작 | an outdoor gear field-use photograph showing one functional action, terrain contact, and credible weather context | semantic-bundle | sports-outdoor | field-use feature | P1:wide-normal 35mm<br>P2:overcast<br>P4:rule-of-thirds<br>P5:fabric-layered-3point<br>P8:eco-conscious-sustainable | L1:ground-plane-shadow-mapping<br>L1:multiple-object-shadow-logic<br>L1:occlusion-shadow-accuracy | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| microadventure-camp-story | 마이크로어드벤처 캠프 스토리 | 근거리 야외 체류에서 장비 배치, 식사, 이동 수단과 사람의 관계를 생활 장면으로 보여주는 컷 | Bundle keys: P1:wide-normal 35mm · P2:soft light · P4:layering · P4:wide-shot · P8:custom-set-vs-location-tradeoff | 작은 캠프 구조, 한 명의 사용자, 이동 수단, 실제 사용 중인 장비 | a microadventure camp story with one user, a compact shelter, transport, and gear in active use | semantic-bundle | sports-outdoor | outdoor lifestyle | P1:wide-normal 35mm<br>P2:soft light<br>P4:layering<br>P4:wide-shot<br>P8:custom-set-vs-location-tradeoff | L1:size-depth-consistency<br>L1:multiple-object-shadow-logic<br>L1:line-convergence-accuracy | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

### 12. Conceptual Staged Production · 콘셉추얼·스테이지드 프로덕션

모듈형 세트, 미니어처 세계, 통제된 은유 정물을 구분한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| modular-set-campaign | 모듈형 세트 캠페인 | 재배치 가능한 프레임, 패널, 플랫폼을 사용해 여러 에셋으로 확장 가능한 캠페인 세계를 만드는 컷 | Bundle keys: P1:normal 50mm · P2:soft light · P4:frame-within-frame · P5:matte · P8:modular-construction-reconfiguration | 반복 모듈, 명확한 조립 논리, 제품 또는 인물의 고정 중심, 변형 가능한 배경 | a modular campaign set with visible reconfiguration logic, repeated structural elements, and one fixed hero subject | semantic-bundle | conceptual-staged-production | modular campaign set | P1:normal 50mm<br>P2:soft light<br>P4:frame-within-frame<br>P5:matte<br>P8:modular-construction-reconfiguration | L1:size-depth-consistency<br>L1:ground-plane-shadow-mapping<br>L1:camera-angle-internal-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| miniature-world-composite | 미니어처 월드 합성 | 실물 제품과 축소 환경을 결합하되 크기, 그림자, 원근 관계를 의도적으로 읽히게 하는 스테이지드 컷 | Bundle keys: P1:normal 50mm · P2:hard light · P4:perspective-exaggeration · P5:matte · P8:real-vs-miniature-decision | 제품과 축소 배경의 명확한 스케일 관계, 일관된 소실점, 접지 그림자 | a miniature-world composite with a deliberate product-to-environment scale relationship and coherent perspective | semantic-bundle | conceptual-staged-production | miniature composite | P1:normal 50mm<br>P2:hard light<br>P4:perspective-exaggeration<br>P5:matte<br>P8:real-vs-miniature-decision | L1:size-depth-consistency<br>L1:vanishing-point-alignment<br>L1:ground-plane-shadow-mapping | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| controlled-metaphor-still-life | 통제된 은유 정물 | 제품과 두세 개의 상징 오브젝트를 물리적으로 가능한 한 장면 안에서 연결하는 콘셉추얼 정물 | Bundle keys: P1:normal 50mm · P2:hard light · P4:negative-space · P5:specular-control · P8:set-composition-brand-integration | 단일 제품, 제한된 상징 오브젝트, 명확한 관계, 과도한 장식 없음 | a controlled metaphor still life connecting one product with two or three physically plausible symbolic objects | semantic-bundle | conceptual-staged-production | conceptual still life | P1:normal 50mm<br>P2:hard light<br>P4:negative-space<br>P5:specular-control<br>P8:set-composition-brand-integration | L1:multiple-object-shadow-logic<br>L1:reflection-angle-law<br>L1:occlusion-shadow-accuracy | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

### 13. Production Context · 촬영 환경·프로덕션 맥락

상업 장르와 별개로 제작 조건을 바꾸는 스튜디오, 로케이션, 항공, 수중 환경을 구분한다.

| Keyword | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Control Class | Commercial Genre | Commercial Use Case | Bundle Keys | QA Keys | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| controlled-studio-production | 통제형 스튜디오 프로덕션 | 광원, 배경, 피사체 위치를 반복 가능하게 고정하는 스튜디오 제작 조건 | Bundle keys: P1:normal 50mm · P2:soft light · P4:negative-space · P5:specular-control · P8:custom-set-vs-location-tradeoff | 제어된 배경, 반복 가능한 그림자, 외부 환경광 없음, 명확한 접지 | a fully controlled studio production with repeatable lighting, backdrop, subject position, and ground contact | semantic-bundle | production-context | controlled studio | P1:normal 50mm<br>P2:soft light<br>P4:negative-space<br>P5:specular-control<br>P8:custom-set-vs-location-tradeoff | L1:single-light-source-consistency<br>L1:ground-plane-shadow-mapping<br>L1:specular-reflection-position | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| on-location-ambient-production | 온로케이션 환경광 프로덕션 | 장소의 구조, 날씨, 시간대와 기존 광원을 촬영 맥락의 일부로 사용하는 제작 조건 | Bundle keys: P1:wide-normal 35mm · P2:overcast · P4:layering · P4:wide-shot · P8:custom-set-vs-location-tradeoff | 실제 장소 단서, 시간대와 날씨의 영향, 자연스러운 환경광 혼합 | an on-location production that preserves real architecture, ambient light, weather, and time-of-day context | semantic-bundle | production-context | on-location production | P1:wide-normal 35mm<br>P2:overcast<br>P4:layering<br>P4:wide-shot<br>P8:custom-set-vs-location-tradeoff | L1:line-convergence-accuracy<br>L1:multiple-object-shadow-logic<br>L1:size-depth-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| aerial-context-production | 항공 맥락 프로덕션 | 지형, 이동 경로, 건축 또는 이벤트의 규모 관계를 위에서 설명하는 항공 촬영 조건 | Bundle keys: P1:wide-normal 35mm · P2:direct sunlight · P4:wide-shot · P4:leading-lines · P8:source-quality-constraints | 넓은 지형 범위, 읽히는 경로, 피사체와 환경의 명확한 스케일 관계 | an aerial context production showing terrain, route, subject, and infrastructure at a legible shared scale | semantic-bundle | production-context | aerial context | P1:wide-normal 35mm<br>P2:direct sunlight<br>P4:wide-shot<br>P4:leading-lines<br>P8:source-quality-constraints | L1:size-depth-consistency<br>L1:line-convergence-accuracy<br>L1:camera-angle-internal-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |
| underwater-field-production | 수중 필드 프로덕션 | 수중의 색 흡수, 부유 입자, 기포, 장비와 피사체의 부력을 실제 환경 조건으로 다루는 촬영 | Bundle keys: P1:wide-normal 35mm · P2:direct sunlight · P4:wide-shot · P5:caustics-projection · P8:source-quality-constraints | 수심에 따른 색 변화, 자연스러운 부유물, 기포 방향, 장비와 신체의 부력 관계 | an underwater field production with plausible depth color loss, suspended particles, bubbles, and buoyancy | semantic-bundle | production-context | underwater field | P1:wide-normal 35mm<br>P2:direct sunlight<br>P4:wide-shot<br>P5:caustics-projection<br>P8:source-quality-constraints | L1:size-depth-consistency<br>L1:multiple-object-shadow-logic<br>L1:camera-angle-internal-consistency | 유력 [C33] · 2026-08-05 승인 소재 조사와 확정 원자 키 조합, 번들 자체 생성 검증 필요 | probable |

## Part 8: 프로덕션 craft·아트디렉션

스타일링(헤어/메이크업/의상/프롭), 세트·로케이션, 리터칭·포스트 (25개 키워드)

### 1. Styling · 스타일링

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-hair-makeup-trends | 2026 헤어·메이크업 트렌드 | 맨네킹 피부 질감, 웨트 이펙트, 대담한 색상 | 반짝이는 피부, 극명한 색감 | 2026 mannequin skin texture, wet glossy effect | [C1][C2] 2소수 | confirmed |
| wardrobe-coordination-fit | 의류 조정·핏 | 실루엣·피팅·맞춤 원칙, 신체 라인 강조 | 정확한 사이징, 팽팽한 드레이프 | wardrobe fit precision, tailored silhouette | [C1][C3] 2소수 | confirmed |
| accessory-jewelry-coordination | 악세서리·주얼리 조정 | 주얼리 스케일, 톤 조화, 과장 회피 | 적절한 스케일, 조화된 톤 | accessory scale harmony, jewelry coordination | [C2][C3] 2소수 | confirmed |
| eco-conscious-sustainable | 친환경·지속 가능 스타일링 | 재사용 소품, 시즌별 의류 기부, 폐기 최소화 | 윤리적 프로덕션 | eco-conscious sustainable styling ethical | [C2][C3] 2소수 | confirmed |

### 2. Set/Location · 세트·로케이션

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| custom-set-vs-location-tradeoff | 커스텀 세트 vs 로케이션 선택 | 제어 vs 맥락: 제어 필요 → 세트, 맥락 필요 → 로케이션 | 완벽 제어 vs 환경 유입 | custom set controlled vs location context | [C7][C8] 2소수 | confirmed |
| set-composition-brand-integration | 세트 구성·브랜드 통합 | 배경이 제품·모델과 시각적 조화, 색 팔레트 통일 | 완벽 색 일관성, 시각 통합 | set composition brand narrative integration | [C7][C8] 2소수 | confirmed |
| modular-construction-reconfiguration | 모듈식 구성·재배치 | 가동식 벽/조명/배경으로 빠른 셋업·변형 | 신속 전환, 재사용성 | modular set construction quick reconfigure | [C8][C9] 2소수 | confirmed |
| real-vs-miniature-decision | 실세트 vs 미니어처 판단 | 스케일·예산·제어 균형: 소형→미니어처, 대형→실세트 | 경제성 + 제어 | real set vs miniature scale decision | [C8][C9] 2소수 | confirmed |

### 3. Retouching · 리터칭

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| basic-corrections-exposure-color | 기본 보정: 노출/색/그림자 | 파운데이션 레벨 보정(클립 회복, 색 캐스트 제거) | 자연스러운 노출, 중립 색 | basic corrections exposure color white-balance | [C10][C11] 2소수 | confirmed |
| product-cleanup-defect-removal | 제품 정리: 결함 제거 | 긁힘·먼지·포장 손상 제거, 얼룩 정리 | 완벽한 제품 표면 | product cleanup defect spotless finish | [C10][C11] 2소수 | confirmed |
| advanced-ghost-mannequin | 고급: 고스트 마네킹 | 의류 형태 보존 + 모델 신체 제거 합성 | 의류만 떠 있는 형태 | ghost mannequin invisible model removal | [C10][C12] 2소수 | confirmed |
| skin-retouching-blemish-removal | 피부 리터칭: 잡티 제거 | 여드름·흉터·혈관 제거, 도드라진 부위 축소 | 매끄러운 피부, 잡티 0 | skin retouching blemish removal smooth texture | [C10][C13] 2소수 | confirmed |
| invisible-retouching-standard | 무시 리터칭 표준 | 보정이 눈에 띄지 않아야 함, 자연스러운 불완전성 유지 | 인위적 효과 없음, 생생함 | invisible retouching natural imperfection retained | [C11][C12] 2소수 | confirmed |
| source-quality-constraints | 소스 품질 제약 | 원본 노이즈/모션블러/피상 결함이 리터칭 난도 결정 | 촬영 품질이 최우선 | source quality captures retouching feasibility | [C11][C12] 2소수 | confirmed |

### 4. Color Grading · 색 그레이딩

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| hdr-3d-lut-grading | HDR·3D LUT 그레이딩 | 고급 색상 매핑, 정확한 룩 재현, 배치 일관성 | 정확한 색감, 극적 톤 | HDR 3D LUT grading color accuracy | [C14][C15] 2소수 | confirmed |
| style-guide-documentation | 스타일 가이드 문서화 | 레퍼런스 이미지+숫자(Kelvin, LUT명)로 표준화 | 일관된 색감, 예측 가능 | style guide color consistency documentation | [C14][C15] 2소수 | confirmed |
| mood-association-warm-cool | 무드 연관: 따뜻함/시원함 | 따뜻함(3500K+, 주황·금) vs 시원함(6500K+, 청·자주) | 명확한 톤 의도 | mood-driven warm golden cool blue tones | [C15][C16] 2소수 | confirmed |
| brand-identity-through-grading | 브랜드 정체성·그레이딩 | 색 그레이딩이 브랜드 성격 표현 (럭셔리=따뜻·자연, 기술=명확·차가움) | 일관된 브랜드 톤 | brand-identity color grading signature look | [C16][C17] 2소수 | confirmed |
| basic-vs-creative-phases | 기본 vs 창작 그레이딩 단계 분리 | 1단계 기본(클립 복구), 2단계 창작(룩 적용) 순차 | 두 단계 명확 분리 | two-phase basic correction creative grading | [C14][C15] 2소수 | confirmed |
| preset-efficiency | 프리셋 효율성 | Lightroom/Capture One 프리셋으로 일괄 적용, 개별 미조정 | 빠른 배치 처리 | preset-based batch efficiency speed | [C17][C18] 2소수 | confirmed |
| cross-platform-color-match | 크로스 플랫폼 색 일치 | 프린트/웹/모바일 각각 색 공간 다름, 마스터·유도본 분리 | 플랫폼별 검증 | cross-platform color space master derivatives | [C18] 1소수 | probable |

### 5. Production Timing · 제작 타이밍

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| preproduction-timeline | 프리프로덕션 타이밍 | 2~14일: 브리프·로케이션 스카우트·세트 준비·샷리스트 | 계획 단계 충분 | preproduction 2-14 days planning | [C19][C20] 2소수 | confirmed |
| shooting-timeline | 촬영 타이밍 | 2~4주: 촬영 자체 (휴일 제외, 날씨 의존) | 촬영 기간 현실 | shooting 2-4 weeks actual production | [C19][C20] 2소수 | confirmed |
| post-timeline | 포스트 타이밍 | 2~6주: 컬링·배치 편집·리터칭·그레이딩 | 배치 처리 기간 | post-production 2-6 weeks retouching grading | [C19][C20] 2소수 | confirmed |
| client-communication-checkpoints | 클라이언트 커뮤니케이션 체크포인트 | 프리-세트 승인·촬영 진행도·포스트 진행도 3회 보고 | 투명한 소통 | client approval checkpoints transparency | [C20] 1소수 | probable |

## Part 9: 필름 질감·현상

아날로그 필름의 감광유제 입자, 할레이션, 반할레이션 구조, 만료와 현상에서 생기는 질감 (5개 키워드)

### 1. 필름 입자·할레이션·현상 특성 · film texture & processing

아날로그 필름의 감광유제, 반할레이션 구조, 보관 상태와 현상 조건이 만드는 입자감과 번짐, 색 변질을 다룬다.

| Keyword | Canonical ID | Relation | 한글 | Definition | Spec | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| film grain (Print Grain Index) |  |  | 필름 그레인 | 감광유제 입자가 만드는 질감. PGI로 정량화 | 4단위=관찰자 90% JND, 25=가시성 임계값. Portra 400 16x20=89 [C9] | 미세~굵은 입자 질감, 확대율 비례 | film grain texture, analog grain | 확정 [C9], MJ 토큰 [C19] | confirmed |
| halation | cp.halation | cross-reference | 할레이션 | rem-jet 백킹 부재 시 하이라이트 광이 유제 뒤에서 반사돼 붉게 번지는 현상 | Vision3의 rem-jet 제거가 Cinestill 할레이션의 모체 [C11] | 밝은 광원 주변 붉은 후광 | red halation glow around highlights | 유력 [C11] | probable |
| RMS granularity |  |  | RMS 그래뉼래러티 | 그레인 굵기를 나타내는 제조사 정량 지표 | Velvia 9, Provia 100F 8, Astia 7, Provia 400F 13, Pro 400H 4 [C12][C13] | 값이 클수록 굵은 입자 | (개념 지표) | 확정 [C12][C13] | confirmed |
| expired film |  |  | 만료 필름 | 유효기간 지난 필름의 색 변질·캐스트 텍스처 | MJ 'Expired 35mm/65mm Film' 토큰 [C19] | 예측불가 색시프트, 얼룩, 변색 | expired 35mm film, faded color shift | 유력, 모델 한정 참고 [C19] | probable |
| rem-jet backing |  |  | 렘젯 백킹 | 시네필름 뒷면의 탄소 반할레이션 층. 제거 여부가 할레이션 유무를 결정 | Vision3 아세테이트 베이스에 rem-jet 존재 [C11] | (제거 시 할레이션 발생) | (개념, 프롬프트 토큰 아님) | 유력 [C11] | probable |

## Part 10: 물리 정합성(anti-slop)

그림자·반사·원근 일관성, 피부 질감(왁스/플라스틱 회피), 톤 과잉 회피. P1·P2·P5 교차 태그 (25개 키워드)

### 1. Skin Texture · 피부 질감

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| subsurface-scattering-ratio | SSS 비율 정상화 | 피부는 표면 반사와 내부 산란이 함께 나타나며 부위와 조명에 따라 반응이 달라짐 | 귀·코·손가락 투명 따뜻한 빛, 자연 반사 | natural skin subsurface scattering, translucent ears | 유력 [C5][C6], 고정 비율 근거 제거 | probable |
| pore-asymmetry-detection | 모공 비대칭 탐지 | 피부 부위와 개인차에 따른 불규칙한 모공 크기와 간격을 확인 | 불규칙한 모공, 개별 결함 | natural asymmetric pore pattern, individual texture | pending(갭), Fibonacci 패턴과 자동 탐지율 근거 제거 | pending-gap |
| macro-magnification-threshold | 매크로 정밀도 임계값 | 근접 촬영에서 미세 주름, 모공, 피부톤 차이가 자연스럽게 드러나는 상태 | 미세 주름, 개별 모공, 피부톤 변화 | high-magnification skin texture, every pore visible | pending(갭), 보편 PPM 임계값 근거 제거 | pending-gap |
| wax-plastic-avoidance | 왁스/플라스틱 피부 회피 | 균일한 표면 광택과 내부 산란 부재로 피부가 왁스나 플라스틱처럼 보이는 현상 | 자연스러운 표피, 표면+내부 혼합 반사 | avoid waxy plastic skin, natural translucence | 유력 [C6][C12], 고정 반사 비율 근거 제거 | probable |
| uncanny-valley-pore-pattern | 언캐니 밸리: 모공 패턴 | 모공의 크기와 간격이 지나치게 균일해 피부가 절차적 텍스처처럼 보이는 현상 | 불규칙한 모공 크기·간격, 자연 변화 | avoid uniform pore grid, natural irregular spacing | 유력 [C11][C12], 자동 탐지 성능 주장 제거 | probable |
| specular-consistency | 스펙큘러 일관성 | 같은 조명에서 얼굴 전체 하이라이트 위치·강도 일관성 | 논리적 하이라이트 배치, 명확한 광원 가정 | consistent specular highlights, single light source | [C6][C13] 2소수 | confirmed |
| skin-tone-gradient | 피부톤 자연 그라데이션 | 얼굴 중심 밝음 → 귀·턱선 점진적 어두움, 경계 선명 금지 | 자연스러운 톤 전이, 명확하지 않은 경계 | natural skin tone gradient, soft transition | 유력 [C5][C13] | probable |
| capillary-blood-flow-signals | 모세혈관 혈류 신호 | 귀·뺨·코 끝의 핑크·빨강, 실맥(subcutaneous veining), 자연 변화 | 세밀한 혈류 색상, 생리적 반응 표현 | visible capillaries, natural blood flow flush | 유력 [C5][C14] | probable |

### 2. Shadow Physics · 그림자 물리

| Keyword | Canonical ID | Relation | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| single-light-source-consistency |  |  | 단일 광원 일관성 | 단일 주광 아래의 투사 그림자가 표면 방향과 광원 크기를 고려해 하나의 광원 위치와 양립 | 일관된 그림자 방향, 명확한 광원 단일화 | single consistent light source, unified shadow direction | 확정 [C3][C15], 허위 C2와 고정 각도 공차 제거 | confirmed |
| impossible-shadow-direction | cp.impossible-shadow-direction | diagnostic-reference | 불가능한 그림자 방향 | 투사 그림자 방향이 화면에 보이는 동기 광원과 양립하지 않거나 공유 장면의 다른 그림자와 충돌 | 그림자 방향 불일관, 다중 모순 광원 신호 | correct shadow direction from single source | 확정 [C3][C16], 허위 C2와 고정 실패율 제거 | confirmed |
| shadow-falloff-continuity |  |  | 그림자 페이드 연속성 | 그림자 경계 soft→hard 자연 그라데이션, 불연속 끊김 금지 | 부드러운 그림자 가장자리, 연속 톤 | smooth shadow falloff, natural gradient transition | [C3][C15] 2소수 | confirmed |
| ground-plane-shadow-mapping |  |  | 바닥면 그림자 맵핑 | 피사체 기저부 그림자가 바닥과 접선, 부유·오프셋 금지 | 바닥면에 자연스럽게 닿는 그림자 | grounded shadow on floor, contact shadow | [C3][C17] 2소수 | confirmed |
| multiple-object-shadow-logic |  |  | 다중 객체 그림자 논리 | 여러 객체의 모든 그림자가 단일 광원 기준 일관성 | 객체 간 그림자 방향 일치, 배경 그림자도 통일 | multiple objects unified shadow direction | [C3][C15] 2소수 | confirmed |
| occlusion-shadow-accuracy |  |  | 폐색(occlusion) 그림자 정확도 | 객체 A가 객체 B를 가릴 때 그림자 패턴이 z-depth 순서와 일치 | 정확한 폐색 그림자, 깊이감 명확 | accurate occlusion shadow, depth-correct | [C3][C17] 2소수 | confirmed |

### 3. Reflection Validation · 반사 검증

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| reflection-angle-law | 반사각 법칙 준수 | 매끄러운 표면에서 입사 방향과 표면 법선에 맞는 반사 방향을 유지하고 거친 표면은 분산 반사를 고려 | 반사각 일관성, 광원 위치와 물리 일치 | correct reflection angle, physical law | [C4][C7][C18] 3소수 | confirmed |
| mirror-surface-camera-environment | 거울 표면: 카메라·환경 노출 | 거울이 카메라 위치와 표면 각도에서 실제로 보일 환경을 기하학적으로 타당하게 반영 | 시점과 거울 각도에 맞는 환경 반사, 임의 장면 합성 없음 | geometrically plausible mirror reflection of the visible environment | [C4][C7][C19] 3소수 | confirmed |
| glass-refraction-plausibility | 유리 굴절 타당성 | 유리 뒤 객체 위치 변화가 파장·곡률로 설명 가능해야 함 | 유리 굴절 논리적 왜곡, 설득력 있는 각도 | glass refraction physically plausible | [C4][C7] 2소수 | confirmed |
| specular-reflection-position | 스펙큘러 반사 위치 | 하이라이트가 광원-카메라-피사체 법선벡터 교점 근처에만 나타남 | 하이라이트 위치 예측 가능, 불가능한 곳 없음 | specular highlight physically positioned | [C4][C7][C18] 3소수 | confirmed |

### 4. Perspective Consistency · 원근 일관성

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| size-depth-consistency | 크기·깊이 일관성 | 같은 거리 객체는 같은 크기, 거리 비례 크기 | 객체 크기가 깊이와 일치, 불가능한 크기 차이 없음 | size-depth consistent scale relationship | [C8][C20] 2소수 | confirmed |
| line-convergence-accuracy | 선-집약 정확도 | 평행선이 소실점으로 수렴, 각도·거리 일관성 | 선명한 소실점, 수렴 일관성 | line convergence accurate perspective | [C8][C20] 2소수 | confirmed |
| camera-angle-internal-consistency | 카메라 앵글 내부 일관성 | eye-level/high-angle 한 이미지 내에서 모든 객체가 동일 카메라 높이 기준 | 카메라 위치 명확, 앵글 내부 불일치 없음 | single camera angle throughout | [C8][C20] 2소수 | confirmed |
| vanishing-point-alignment | 소실점 정렬 | 구도 선이 정확히 한 또는 두 소실점으로 수렴 | 기하학적 원근 일관성, 소실점 명확 | correct vanishing point alignment | [C8][C20] 2소수 | confirmed |

### 5. Tone Avoidance · 톤 과잉 회피

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| crushed-black-realism | 검은색 과잉 회피: '톤 뭉개짐' | 의도와 무관하게 넓은 섀도 영역의 세부가 완전 검정으로 소실되는 현상 | 섀도 내 보이는 디테일, 톤 분리 | avoid crushed blacks, detail in shadows | 유력, 장면 독립적인 고정 면적 임계값 근거 제거 | probable |
| extreme-highlight-clipping | 극도 하이라이트 클리핑 | 의도와 무관하게 넓은 하이라이트 영역의 질감과 색 정보가 순백으로 소실되는 현상 | 하이라이트 디테일 보존, 클리핑 최소 | preserve highlight detail, avoid blown-out | 유력, 장면 독립적인 고정 면적 임계값 근거 제거 | probable |

### 6. AI Forensics · AI 포렌식

| Keyword | 한글 | Definition | Visual Signature | Prompt Fragment | Verification | Status |
| --- | --- | --- | --- | --- | --- | --- |
| histogram-entropy-distribution | 히스토그램 엔트로피 분포 | 히스토그램 형태만으로 실사와 생성 이미지를 판정할 수 있다는 미검증 가설 | 자연스러운 톤 분포, 극단 대비 회피 | natural tonal distribution with retained midtone detail | pending(갭), 히스토그램 형태의 단독 판별 근거 없음 | pending-gap |
