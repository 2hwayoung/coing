package com.coing.domain.chat.controller

import com.coing.domain.chat.entity.ChatMessage
import com.coing.domain.chat.service.ChatReportService
import com.coing.domain.chat.service.ChatService
import com.coing.domain.user.dto.CustomUserPrincipal
import com.coing.domain.user.entity.User
import com.coing.domain.user.repository.UserRepository
import com.coing.global.exception.doc.ApiErrorCodeExamples
import com.coing.global.exception.doc.ErrorCode
import com.coing.util.BasicResponse
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@Tag(name = "ChatReport API", description = "채팅 신고 관련 API 엔드포인트")
@RestController
@RequestMapping("/api/chat/messages")
class ChatReportController(
    private val chatService: ChatService,
    private val chatReportService: ChatReportService,
    private val userRepository: UserRepository  // DB에서 User 엔티티 조회
) {

    /**
     * 신고 API
     *
     * 경로: /api/chat/messages/{messageId}/report
     * HTTP 메서드: POST
     *
     * @param messageId 신고할 메시지의 ID
     * @param principal 현재 인증된 사용자 (신고자)
     */
    @Operation(summary = "메세지 신고하기")
    @ApiErrorCodeExamples(
        ErrorCode.MESSAGE_NOT_FOUND,
        ErrorCode.MESSAGE_ALREADY_REPORTED,
        ErrorCode.MEMBER_NOT_FOUND,
        ErrorCode.MESSAGE_REPORT_FAILED,
        ErrorCode.INTERNAL_SERVER_ERROR
    )
    @PostMapping("/{messageId}/report")
    fun reportMessage(
        @PathVariable messageId: String,
        @AuthenticationPrincipal principal: CustomUserPrincipal?
    ): ResponseEntity<BasicResponse> {

        // 비로그인 사용자는 에러
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(BasicResponse(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.", ""))
        }

        // principal.id로 실제 DB User 조회
        val reporter: User = userRepository.findById(principal.id).orElse(null)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(BasicResponse(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.", ""))

        // 캐시나 DB에서 메시지 조회
        val message: ChatMessage = chatService.findMessageById(messageId)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(BasicResponse(HttpStatus.NOT_FOUND, "메시지를 찾을 수 없습니다.", ""))

        return try {
            // 신고를 처리하고 신고 내역을 DB에 저장
            chatReportService.reportMessage(message, reporter)
            ResponseEntity.ok(BasicResponse(HttpStatus.OK, "메시지가 신고되었습니다.", ""))
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(BasicResponse(HttpStatus.BAD_REQUEST, e.message ?: "신고에 실패했습니다.", ""))
        }
    }
}
