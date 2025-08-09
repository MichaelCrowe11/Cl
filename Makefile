prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

sbom:
	python -m pip install cyclonedx-bom
	cyclonedx-py -o dist/sbom.xml
