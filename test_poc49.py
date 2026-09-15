from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from pathlib import Path
from datetime import datetime
import urllib.request
import json
import time

FRONTEND_URL = "https://poc-49-clinical-ai-diagnostics-adoption-bzp5.onrender.com"
BACKEND_URL = "https://poc-49-clinical-ai-diagnostics-adoption.onrender.com"

BASE_DIR = Path(__file__).resolve().parent
REPORT_FILE = BASE_DIR / "Test_Report.txt"
SCREENSHOT_FILE = BASE_DIR / "selenium_execution.png"

results = []


def record(name, passed, detail=""):
    results.append((name, passed, detail))
    print(f"[{'PASS' if passed else 'FAIL'}] {name}")

    if detail:
        print(f"     {detail}")


def wait_for_text(driver, text, timeout=15):
    WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                f"//*[contains(normalize-space(), '{text}')]"
            )
        )
    )


def main():

    options = Options()

    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1366,900")

    driver = webdriver.Chrome(options=options)

    driver.set_page_load_timeout(60)

    try:

        # ============================================================
        # 1. PAGE LOAD
        # ============================================================

        try:

            driver.get(FRONTEND_URL)

            wait_for_text(
                driver,
                "Clinical AI Diagnostics Adoption Monitoring Dashboard",
                40
            )

            record(
                "Page Load",
                True,
                f"Live Render URL loaded: {FRONTEND_URL}"
            )

        except Exception as e:

            record(
                "Page Load",
                False,
                f"{type(e).__name__}: {e}"
            )

            return


        time.sleep(4)


        # ============================================================
        # 2. VISUALIZATION RENDERING
        # ============================================================

        try:

            WebDriverWait(driver, 30).until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, ".leaflet-container")
                )
            )

            WebDriverWait(driver, 30).until(
                lambda d:
                len(
                    d.find_elements(
                        By.CSS_SELECTOR,
                        ".leaflet-interactive"
                    )
                ) > 0
            )

            markers = driver.find_elements(
                By.CSS_SELECTOR,
                ".leaflet-interactive"
            )

            record(
                "Visualization Rendering",
                True,
                f"Leaflet map visible; facility markers detected: {len(markers)}"
            )

        except Exception as e:

            record(
                "Visualization Rendering",
                False,
                f"{type(e).__name__}: {e}"
            )


        # ============================================================
        # 3. DATA LOADING
        # ============================================================

        try:

            status = WebDriverWait(
                driver,
                30
            ).until(
                lambda d: next(
                    (
                        el.text.strip()
                        for el in d.find_elements(
                            By.XPATH,
                            "//*[contains(., 'facilities')]"
                        )
                        if el.is_displayed()
                        and "facilities" in el.text.lower()
                    ),
                    None
                )
            )

            if not status:

                raise AssertionError(
                    "Facility count/status was not found."
                )

            record(
                "Data Loading",
                any(c.isdigit() for c in status),
                f"Map status: {status}"
            )

        except Exception as e:

            record(
                "Data Loading",
                False,
                f"{type(e).__name__}: {e}"
            )


        # ============================================================
        # 4. USE CASE FILTER INTERACTION
        # ============================================================

        try:

            # Open Intelligence panel

            open_button = WebDriverWait(
                driver,
                15
            ).until(
                EC.presence_of_element_located(
                    (
                        By.CSS_SELECTOR,
                        "button[aria-label='Open intelligence panel']"
                    )
                )
            )

            driver.execute_script(
                "arguments[0].click();",
                open_button
            )

            # Wait for panel

            WebDriverWait(
                driver,
                15
            ).until(
                EC.presence_of_element_located(
                    (
                        By.CSS_SELECTOR,
                        "button[aria-label='Close intelligence panel']"
                    )
                )
            )

            time.sleep(1)

            filter_results = []

            for label in [
                "All",
                "Radiology",
                "Pathology",
                "Triage"
            ]:

                buttons = [
                    b
                    for b in driver.find_elements(
                        By.TAG_NAME,
                        "button"
                    )
                    if b.is_displayed()
                    and b.text.strip().lower()
                    == label.lower()
                ]

                if not buttons:

                    raise AssertionError(
                        f"Visible filter button '{label}' was not found."
                    )

                button = buttons[0]

                driver.execute_script(
                    """
                    arguments[0].scrollIntoView({
                        block: 'center'
                    });
                    """,
                    button
                )

                time.sleep(0.3)

                driver.execute_script(
                    "arguments[0].click();",
                    button
                )

                time.sleep(2)

                markers = driver.find_elements(
                    By.CSS_SELECTOR,
                    ".leaflet-interactive"
                )

                if len(markers) == 0:

                    raise AssertionError(
                        f"{label} filter produced zero map features."
                    )

                filter_results.append(
                    f"{label}={len(markers)} facilities"
                )

            record(
                "Use Case Filter Interaction",
                True,
                "; ".join(filter_results)
            )

        except Exception as e:

            try:
                driver.save_screenshot(
                    str(BASE_DIR / "filter_failure.png")
                )
            except Exception:
                pass

            record(
                "Use Case Filter Interaction",
                False,
                f"{type(e).__name__}: {e}"
            )


        # ============================================================
        # 5. MAP FACILITY INTERACTION
        # ============================================================

        try:

            # Close intelligence panel

            close_buttons = driver.find_elements(
                By.CSS_SELECTOR,
                "button[aria-label='Close intelligence panel']"
            )

            if close_buttons:

                driver.execute_script(
                    "arguments[0].click();",
                    close_buttons[0]
                )

                time.sleep(2)


            # Reopen panel and select All

            open_button = WebDriverWait(
                driver,
                10
            ).until(
                EC.presence_of_element_located(
                    (
                        By.CSS_SELECTOR,
                        "button[aria-label='Open intelligence panel']"
                    )
                )
            )

            driver.execute_script(
                "arguments[0].click();",
                open_button
            )

            time.sleep(1)


            all_buttons = [
                b
                for b in driver.find_elements(
                    By.TAG_NAME,
                    "button"
                )
                if b.is_displayed()
                and b.text.strip().lower() == "all"
            ]

            if all_buttons:

                driver.execute_script(
                    "arguments[0].click();",
                    all_buttons[0]
                )

            time.sleep(2)


            # Close panel

            close_buttons = driver.find_elements(
                By.CSS_SELECTOR,
                "button[aria-label='Close intelligence panel']"
            )

            if close_buttons:

                driver.execute_script(
                    "arguments[0].click();",
                    close_buttons[0]
                )

                time.sleep(2)


            # Find map facility

            markers = WebDriverWait(
                driver,
                15
            ).until(
                lambda d:
                d.find_elements(
                    By.CSS_SELECTOR,
                    ".leaflet-interactive"
                )
            )

            if not markers:

                raise AssertionError(
                    "No facility map features found."
                )

            marker = markers[0]


            # Scroll marker into view

            driver.execute_script(
                """
                arguments[0].scrollIntoView({
                    block: 'center'
                });
                """,
                marker
            )

            time.sleep(0.5)


            # Click actual center of SVG CircleMarker

            driver.execute_script(
                """
                const el = arguments[0];

                const r = el.getBoundingClientRect();

                const eventOptions = {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: r.left + r.width / 2,
                    clientY: r.top + r.height / 2
                };

                el.dispatchEvent(
                    new MouseEvent(
                        'mousedown',
                        eventOptions
                    )
                );

                el.dispatchEvent(
                    new MouseEvent(
                        'mouseup',
                        eventOptions
                    )
                );

                el.dispatchEvent(
                    new MouseEvent(
                        'click',
                        eventOptions
                    )
                );
                """,
                marker
            )

            time.sleep(2)


            # Facility panel should open

            WebDriverWait(
                driver,
                15
            ).until(
                EC.presence_of_element_located(
                    (
                        By.CSS_SELECTOR,
                        "button[aria-label='Close intelligence panel']"
                    )
                )
            )

            wait_for_text(
                driver,
                "Selected data point",
                10
            )

            wait_for_text(
                driver,
                "Use-case coverage",
                10
            )

            record(
                "Map Facility Interaction",
                True,
                "Facility marker opened the Facility intelligence view."
            )

        except Exception as e:

            try:
                driver.save_screenshot(
                    str(BASE_DIR / "map_failure.png")
                )
            except Exception:
                pass

            record(
                "Map Facility Interaction",
                False,
                f"{type(e).__name__}: {e}"
            )


        # ============================================================
        # 6. INTELLIGENCE PANEL INTERACTION
        # ============================================================

        try:

            close_buttons = driver.find_elements(
                By.CSS_SELECTOR,
                "button[aria-label='Close intelligence panel']"
            )

            if close_buttons:

                driver.execute_script(
                    "arguments[0].click();",
                    close_buttons[0]
                )

                time.sleep(1)


            open_button = driver.find_element(
                By.CSS_SELECTOR,
                "button[aria-label='Open intelligence panel']"
            )

            driver.execute_script(
                "arguments[0].click();",
                open_button
            )

            time.sleep(1)


            wait_for_text(
                driver,
                "Clinical AI Diagnostics Adoption Monitor",
                10
            )


            # Click Analytics

            analytics_buttons = [
                b
                for b in driver.find_elements(
                    By.TAG_NAME,
                    "button"
                )
                if b.is_displayed()
                and b.text.strip().lower()
                == "analytics"
            ]

            if not analytics_buttons:

                raise AssertionError(
                    "Analytics tab was not found."
                )

            driver.execute_script(
                "arguments[0].click();",
                analytics_buttons[0]
            )

            time.sleep(3)


            wait_for_text(
                driver,
                "Adoption rate by use case",
                15
            )

            wait_for_text(
                driver,
                "Diagnostic concordance vs specialist read",
                15
            )

            wait_for_text(
                driver,
                "Time-to-report improvement",
                15
            )

            wait_for_text(
                driver,
                "Use-case coverage matrix",
                15
            )


            record(
                "Intelligence Panel Interaction",
                True,
                "Insights and Analytics tabs opened and rendered dashboard content."
            )

        except Exception as e:

            record(
                "Intelligence Panel Interaction",
                False,
                f"{type(e).__name__}: {e}"
            )


        # ============================================================
        # 7. DEVELOPER SIGNATURE
        # ============================================================

        try:

            close_buttons = driver.find_elements(
                By.CSS_SELECTOR,
                "button[aria-label='Close intelligence panel']"
            )

            if close_buttons:

                driver.execute_script(
                    "arguments[0].click();",
                    close_buttons[0]
                )

                time.sleep(1)


            info_button = driver.find_element(
                By.CSS_SELECTOR,
                "button[aria-label='Project information']"
            )

            driver.execute_script(
                "arguments[0].click();",
                info_button
            )

            time.sleep(1)


            wait_for_text(
                driver,
                "Developer Signature",
                10
            )

            wait_for_text(
                driver,
                "Thara Asharaf",
                10
            )

            wait_for_text(
                driver,
                "49",
                10
            )

            wait_for_text(
                driver,
                "Thara81",
                10
            )

            wait_for_text(
                driver,
                "Batch 6 Interns",
                10
            )


            record(
                "Developer Signature",
                True,
                "Architect, POC ID, GitHub username, and Batch 6 signature verified."
            )

        except Exception as e:

            record(
                "Developer Signature",
                False,
                f"{type(e).__name__}: {e}"
            )


        # ============================================================
        # 8. FRONTEND-BACKEND HANDSHAKE
        # ============================================================

        try:

            api_url = (
                BACKEND_URL
                + "/api/meta"
            )

            request = urllib.request.Request(
                api_url,
                headers={
                    "User-Agent":
                    "POC-49-Selenium-Quality-Gate"
                }
            )

            with urllib.request.urlopen(
                request,
                timeout=30
            ) as response:

                status = response.status

                body = response.read().decode(
                    "utf-8"
                )


            data = json.loads(body)


            passed = (
                status == 200
                and isinstance(data, dict)
                and data.get("rail")
                == "Clinical AI"
                and data.get("poc_title")
                == "Clinical AI Diagnostics Adoption Monitor"
            )


            record(
                "Frontend-Backend Handshake",
                passed,
                (
                    f"Live backend /api/meta "
                    f"status={status}; "
                    f"valid Clinical AI JSON received."
                )
            )

        except Exception as e:

            record(
                "Frontend-Backend Handshake",
                False,
                f"{type(e).__name__}: {e}"
            )


        # ============================================================
        # 9. RESPONSIVE LAYOUT
        # ============================================================

        try:

            driver.set_window_size(
                502,
                900
            )

            time.sleep(2)


            viewport_width = driver.execute_script(
                "return document.documentElement.clientWidth;"
            )

            document_width = driver.execute_script(
                "return document.documentElement.scrollWidth;"
            )

            overflow = max(
                0,
                document_width - viewport_width
            )


            passed = (
                viewport_width <= 510
                and overflow <= 5
            )


            record(
                "Responsive Layout",
                passed,
                (
                    f"Viewport={viewport_width}px, "
                    f"document width={document_width}px, "
                    f"overflow={overflow}px"
                )
            )

        except Exception as e:

            record(
                "Responsive Layout",
                False,
                f"{type(e).__name__}: {e}"
            )


        # ============================================================
        # SCREENSHOT
        # ============================================================

        driver.set_window_size(
            1366,
            900
        )

        time.sleep(1)

        driver.save_screenshot(
            str(SCREENSHOT_FILE)
        )


    finally:

        # ============================================================
        # FINAL REPORT
        # ============================================================

        total = len(results)

        passed_count = sum(
            1
            for _, passed, _
            in results
            if passed
        )

        failed_count = (
            total - passed_count
        )

        overall_pass = (
            total == 9
            and passed_count == 9
        )


        report = [
            "POC-49 SELENIUM E2E QUALITY GATE REPORT",
            "=" * 50,
            (
                "Execution time: "
                + datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
            ),
            "",
            f"Live Frontend URL: {FRONTEND_URL}",
            f"Live Backend URL: {BACKEND_URL}",
            ""
        ]


        for name, passed, detail in results:

            report.append(
                f"[{'PASS' if passed else 'FAIL'}] {name}"
            )

            if detail:

                report.append(
                    f"     {detail}"
                )


        report.extend([
            "",
            (
                f"SUMMARY: "
                f"{passed_count}/{total} tests passed; "
                f"{failed_count} failed"
            ),
            (
                "OVERALL: PASS - 100% QUALITY GATE PASSED"
                if overall_pass
                else
                "OVERALL: FAIL - QUALITY GATE NOT PASSED"
            ),
            (
                "AUTOMATION CERTIFIED"
                if overall_pass
                else
                "AUTOMATION NOT CERTIFIED"
            )
        ])


        REPORT_FILE.write_text(
            "\n".join(report),
            encoding="utf-8"
        )


        print()
        print("=" * 50)

        print(
            f"SUMMARY: "
            f"{passed_count}/{total} tests passed; "
            f"{failed_count} failed"
        )


        if overall_pass:

            print(
                "OVERALL: PASS - 100% QUALITY GATE PASSED"
            )

            print(
                "AUTOMATION CERTIFIED"
            )

        else:

            print(
                "OVERALL: FAIL - QUALITY GATE NOT PASSED"
            )

            print(
                "AUTOMATION NOT CERTIFIED"
            )


        print(
            f"Report: {REPORT_FILE}"
        )

        print(
            f"Screenshot: {SCREENSHOT_FILE}"
        )


        driver.quit()


if __name__ == "__main__":
    main()